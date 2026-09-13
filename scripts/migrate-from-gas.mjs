/**
 * Google Apps Script (기존 Sheets API) → Supabase 일회성 이관
 *
 * Usage:
 *   GOOGLE_SCRIPT_URL=... ADMIN_API_SECRET=... npm run migrate:gas
 *
 * Or add to .env.local temporarily:
 *   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 *   ADMIN_API_SECRET=vellune-admin-api-2026
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function parsePrivacy(value) {
  const normalized = String(value ?? "").trim().toUpperCase();
  return normalized === "YES" || normalized === "TRUE" || normalized === "Y";
}

function parseDate(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return new Date().toISOString();
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
}

function normalizeStatus(value) {
  const status = String(value ?? "NEW").trim().toUpperCase();
  const allowed = ["NEW", "CHECKED", "REPLIED", "COMPLETED"];
  return allowed.includes(status) ? status : "NEW";
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const adminSecret = process.env.ADMIN_API_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!scriptUrl || !adminSecret) {
    console.error(
      "Missing GOOGLE_SCRIPT_URL or ADMIN_API_SECRET.\n" +
        "Add them temporarily to .env.local, or export CSV and run: npm run migrate:sheets -- ../data/inquiries.csv",
    );
    process.exit(1);
  }

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const listUrl = new URL(scriptUrl);
  listUrl.searchParams.set("action", "list");
  listUrl.searchParams.set("secret", adminSecret);

  console.log("Fetching inquiries from Google Apps Script...");
  const response = await fetch(listUrl.toString());
  if (!response.ok) {
    throw new Error(`GAS fetch failed: HTTP ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error ?? "GAS returned failure");
  }

  const inquiries = result.inquiries ?? [];
  if (inquiries.length === 0) {
    console.log("No inquiries found in Google Sheets.");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existing } = await supabase.from("inquiries").select("display_id");
  const existingIds = new Set((existing ?? []).map((row) => row.display_id));

  const rows = inquiries
    .filter((item) => item.id && !existingIds.has(item.id))
    .map((item) => ({
      display_id: item.id,
      created_at: parseDate(item.date),
      type: item.type || "GENERAL",
      company: item.company || "",
      name: item.name || "Unknown",
      email: item.email || "unknown@example.com",
      phone: item.phone || "",
      message: item.message || "",
      privacy: parsePrivacy(item.privacy),
      status: normalizeStatus(item.status),
      notes: item.notes || "",
    }));

  if (rows.length === 0) {
    console.log("All inquiries already exist in Supabase. Nothing to import.");
    return;
  }

  const { error } = await supabase.from("inquiries").insert(rows);
  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  let maxNum = 0;
  for (const row of rows) {
    const match = String(row.display_id).match(/^VL-(\d+)$/i);
    if (match) maxNum = Math.max(maxNum, Number(match[1]));
  }

  console.log(`Imported ${rows.length} inquiries into Supabase.`);
  if (maxNum > 0) {
    console.log(
      `\nRun this in Supabase SQL Editor to sync VL-xxx sequence:\n` +
        `select setval('public.inquiry_seq', ${maxNum + 1}, false);`,
    );
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
