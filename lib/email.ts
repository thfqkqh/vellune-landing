import { Resend } from "resend";
import type { InquiryRow } from "./supabase/server";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  return new Resend(apiKey);
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "thfqkqh@gmail.com";
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
}

export async function sendInquiryNotificationEmail(inquiry: InquiryRow) {
  const resend = getResend();
  const subject = `[VELLUNE] New Inquiry ${inquiry.display_id}`;

  const htmlBody = `
    <h2>VELLUNE New Inquiry</h2>
    <p>A new inquiry has been received.</p>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
      <tr><td><strong>ID</strong></td><td>${inquiry.display_id}</td></tr>
      <tr><td><strong>Date</strong></td><td>${inquiry.created_at}</td></tr>
      <tr><td><strong>Type</strong></td><td>${inquiry.type}</td></tr>
      <tr><td><strong>Company</strong></td><td>${inquiry.company || "-"}</td></tr>
      <tr><td><strong>Name</strong></td><td>${inquiry.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${inquiry.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${inquiry.phone || "-"}</td></tr>
      <tr><td><strong>Privacy</strong></td><td>${inquiry.privacy ? "YES" : "NO"}</td></tr>
    </table>
    <p><strong>Message</strong></p>
    <p style="white-space:pre-wrap;">${inquiry.message}</p>
  `;

  const textBody = [
    "VELLUNE New Inquiry",
    "",
    `ID: ${inquiry.display_id}`,
    `Date: ${inquiry.created_at}`,
    `Type: ${inquiry.type}`,
    `Company: ${inquiry.company || "-"}`,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || "-"}`,
    `Privacy: ${inquiry.privacy ? "YES" : "NO"}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");

  const { error } = await resend.emails.send({
    from: `VELLUNE Contact <${getFromEmail()}>`,
    to: [getAdminEmail()],
    replyTo: inquiry.email,
    subject,
    html: htmlBody,
    text: textBody,
  });

  if (error) {
    throw new Error(error.message);
  }
}
