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

function parseCsv(content) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(current);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }

  return rows;
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

function extractMaxDisplayId(rows) {
  let max = 0;
  for (const row of rows) {
    const match = String(row.display_id ?? "").match(/^VL-(\d+)$/i);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return max;
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npm run migrate:sheets -- path/to/inquiries.csv");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const absoluteCsvPath = resolve(process.cwd(), csvPath);
  const csvContent = readFileSync(absoluteCsvPath, "utf8");
  const table = parseCsv(csvContent);

  if (table.length < 2) {
    console.error("CSV must include a header row and at least one data row.");
    process.exit(1);
  }

  const header = table[0].map((cell) => cell.trim().toUpperCase());
  const dataRows = table.slice(1);

  const indexOf = (name) => {
    const idx = header.indexOf(name);
    if (idx === -1) {
      throw new Error(`Missing required CSV column: ${name}`);
    }
    return idx;
  };

  const mappedRows = dataRows.map((row) => ({
    display_id: row[indexOf("ID")]?.trim(),
    created_at: parseDate(row[indexOf("DATE")]),
    type: row[indexOf("TYPE")]?.trim() || "GENERAL",
    company: row[indexOf("COMPANY")]?.trim() || "",
    name: row[indexOf("NAME")]?.trim() || "Unknown",
    email: row[indexOf("EMAIL")]?.trim() || "unknown@example.com",
    phone: row[indexOf("PHONE")]?.trim() || "",
    message: row[indexOf("MESSAGE")]?.trim() || "",
    privacy: parsePrivacy(row[indexOf("PRIVACY")]),
    status: normalizeStatus(row[indexOf("STATUS")]),
    notes: header.includes("NOTES") ? row[header.indexOf("NOTES")]?.trim() || "" : "",
  }));

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < mappedRows.length; i += batchSize) {
    const batch = mappedRows.slice(i, i + batchSize);
    const { error } = await supabase.from("inquiries").insert(batch);
    if (error) {
      console.error("Insert failed:", error.message);
      process.exit(1);
    }
    inserted += batch.length;
  }

  const maxId = extractMaxDisplayId(mappedRows);
  console.log(`Imported ${inserted} inquiries from ${absoluteCsvPath}`);
  if (maxId > 0) {
    console.log(
      `Next step: run sequence sync SQL from supabase/README.md (max display_id: VL-${String(maxId).padStart(3, "0")})`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
