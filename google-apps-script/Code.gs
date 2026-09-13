/**
 * VELLUNE Google Apps Script (Contact + Admin API)
 *
 * Sheet columns (INQUIRIES tab):
 * A ID | B DATE | C TYPE | D COMPANY | E NAME | F EMAIL | G PHONE
 * H MESSAGE | I PRIVACY | J STATUS | K NOTES(비고)
 *
 * Script Properties (Project Settings > Script properties):
 *   ADMIN_SECRET = your-admin-api-secret
 *
 * Deploy Web App:
 *   Execute as: Me | Who has access: Anyone
 */

const ADMIN_EMAIL = "thfqkqh@gmail.com";
const SHEET_NAME = "INQUIRIES";
const COL = {
  ID: 1,
  DATE: 2,
  TYPE: 3,
  COMPANY: 4,
  NAME: 5,
  EMAIL: 6,
  PHONE: 7,
  MESSAGE: 8,
  PRIVACY: 9,
  STATUS: 10,
  NOTES: 11,
};
const STATUS_OPTIONS = ["NEW", "CHECKED", "REPLIED", "COMPLETED"];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === "update") {
      verifyAdminSecret_(data.secret);
      return updateInquiry_(data);
    }

    return createContactInquiry_(data);
  } catch (error) {
    return createResponse({
      success: false,
      error: error && error.message ? error.message : "Unknown error",
    });
  }
}

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || "";

    if (action === "list") {
      verifyAdminSecret_(params.secret);
      return listInquiries_();
    }

    return createResponse({ success: true, message: "VELLUNE API ready." });
  } catch (error) {
    return createResponse({
      success: false,
      error: error && error.message ? error.message : "Unknown error",
    });
  }
}

function createContactInquiry_(data) {
  const sheet = getInquiriesSheet_();
  ensureHeaderRow_(sheet);

  const lastRow = sheet.getLastRow();
  const nextNumber = Math.max(lastRow, 1);
  const inquiryId = "VL-" + String(nextNumber).padStart(3, "0");
  const submittedAt = new Date();

  sheet.appendRow([
    inquiryId,
    submittedAt,
    data.type || "",
    data.company || "",
    data.name || "",
    data.email || "",
    data.phone || "",
    data.message || "",
    data.privacy || "NO",
    "NEW",
    "",
  ]);

  let emailSent = false;
  let emailError = "";

  try {
    sendInquiryNotificationEmail({
      inquiryId: inquiryId,
      submittedAt: submittedAt,
      type: data.type || "",
      company: data.company || "",
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      message: data.message || "",
      privacy: data.privacy || "NO",
    });
    emailSent = true;
  } catch (mailError) {
    emailError = mailError && mailError.message ? mailError.message : "Unknown mail error";
    Logger.log("Email notification failed: " + emailError);
  }

  return createResponse({
    success: true,
    id: inquiryId,
    emailSent: emailSent,
    emailError: emailError || undefined,
  });
}

function listInquiries_() {
  const sheet = getInquiriesSheet_();
  ensureHeaderRow_(sheet);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return createResponse({ success: true, inquiries: [] });
  }

  const values = sheet.getRange(2, 1, lastRow, COL.NOTES).getValues();
  const inquiries = values.map(function (row, index) {
    return rowToInquiry_(row, index + 2);
  });

  inquiries.sort(function (a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return createResponse({ success: true, inquiries: inquiries });
}

function updateInquiry_(data) {
  const sheet = getInquiriesSheet_();
  ensureHeaderRow_(sheet);

  const rowIndex = findRowById_(sheet, data.id);
  if (rowIndex === -1) {
    throw new Error("Inquiry not found: " + data.id);
  }

  if (data.status !== undefined) {
    const status = String(data.status).toUpperCase();
    if (STATUS_OPTIONS.indexOf(status) === -1) {
      throw new Error("Invalid status: " + status);
    }
    sheet.getRange(rowIndex, COL.STATUS).setValue(status);
  }

  if (data.notes !== undefined) {
    sheet.getRange(rowIndex, COL.NOTES).setValue(String(data.notes));
  }

  const updatedRow = sheet.getRange(rowIndex, 1, 1, COL.NOTES).getValues()[0];

  return createResponse({
    success: true,
    inquiry: rowToInquiry_(updatedRow, rowIndex),
  });
}

function rowToInquiry_(row, rowIndex) {
  const dateValue = row[COL.DATE - 1];
  const formattedDate =
    dateValue instanceof Date
      ? formatDate(dateValue)
      : dateValue
        ? String(dateValue)
        : "";

  return {
    rowIndex: rowIndex,
    id: String(row[COL.ID - 1] || ""),
    date: formattedDate,
    type: String(row[COL.TYPE - 1] || ""),
    company: String(row[COL.COMPANY - 1] || ""),
    name: String(row[COL.NAME - 1] || ""),
    email: String(row[COL.EMAIL - 1] || ""),
    phone: String(row[COL.PHONE - 1] || ""),
    message: String(row[COL.MESSAGE - 1] || ""),
    privacy: String(row[COL.PRIVACY - 1] || ""),
    status: String(row[COL.STATUS - 1] || "NEW"),
    notes: String(row[COL.NOTES - 1] || ""),
  };
}

function findRowById_(sheet, inquiryId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  const ids = sheet.getRange(2, COL.ID, lastRow, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(inquiryId)) {
      return i + 2;
    }
  }
  return -1;
}

function getInquiriesSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
  }
  if (!sheet) {
    throw new Error("No sheet found in spreadsheet.");
  }
  return sheet;
}

function ensureHeaderRow_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "ID",
      "DATE",
      "TYPE",
      "COMPANY",
      "NAME",
      "EMAIL",
      "PHONE",
      "MESSAGE",
      "PRIVACY",
      "STATUS",
      "NOTES",
    ]);
    return;
  }

  const headers = sheet.getRange(1, 1, 1, COL.NOTES).getValues()[0];
  const expected = [
    "ID",
    "DATE",
    "TYPE",
    "COMPANY",
    "NAME",
    "EMAIL",
    "PHONE",
    "MESSAGE",
    "PRIVACY",
    "STATUS",
    "NOTES",
  ];

  for (var i = 0; i < expected.length; i++) {
    if (!headers[i]) {
      sheet.getRange(1, i + 1).setValue(expected[i]);
    }
  }
}

function verifyAdminSecret_(secret) {
  const expected = PropertiesService.getScriptProperties().getProperty("ADMIN_SECRET");
  if (!expected) {
    throw new Error("ADMIN_SECRET is not configured in Script Properties.");
  }
  if (String(secret) !== String(expected)) {
    throw new Error("Unauthorized.");
  }
}

function testSendEmail() {
  sendInquiryNotificationEmail({
    inquiryId: "VL-TEST",
    submittedAt: new Date(),
    type: "GENERAL",
    company: "Test Company",
    name: "테스트",
    email: "test@example.com",
    phone: "010-0000-0000",
    message: "Apps Script 메일 테스트입니다.",
    privacy: "YES",
  });
  Logger.log("Test email sent to " + ADMIN_EMAIL);
}

function sendInquiryNotificationEmail(inquiry) {
  const subject = "[VELLUNE] New Inquiry " + inquiry.inquiryId;
  const spreadsheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  const htmlBody =
    "<h2>VELLUNE New Inquiry</h2>" +
    "<p>A new inquiry has been received.</p>" +
    "<table cellpadding='8' cellspacing='0' style='border-collapse:collapse;'>" +
    "<tr><td><strong>ID</strong></td><td>" + escapeHtml(inquiry.inquiryId) + "</td></tr>" +
    "<tr><td><strong>Date</strong></td><td>" + escapeHtml(formatDate(inquiry.submittedAt)) + "</td></tr>" +
    "<tr><td><strong>Type</strong></td><td>" + escapeHtml(inquiry.type) + "</td></tr>" +
    "<tr><td><strong>Company</strong></td><td>" + escapeHtml(inquiry.company || "-") + "</td></tr>" +
    "<tr><td><strong>Name</strong></td><td>" + escapeHtml(inquiry.name) + "</td></tr>" +
    "<tr><td><strong>Email</strong></td><td>" + escapeHtml(inquiry.email) + "</td></tr>" +
    "<tr><td><strong>Phone</strong></td><td>" + escapeHtml(inquiry.phone || "-") + "</td></tr>" +
    "<tr><td><strong>Privacy</strong></td><td>" + escapeHtml(inquiry.privacy) + "</td></tr>" +
    "</table>" +
    "<p><strong>Message</strong></p>" +
    "<p style='white-space:pre-wrap;'>" + escapeHtml(inquiry.message) + "</p>" +
    "<p><a href='" + spreadsheetUrl + "'>Open Google Sheet</a></p>";

  const plainBody =
    "VELLUNE New Inquiry\n\n" +
    "ID: " + inquiry.inquiryId + "\n" +
    "Date: " + formatDate(inquiry.submittedAt) + "\n" +
    "Type: " + inquiry.type + "\n" +
    "Company: " + (inquiry.company || "-") + "\n" +
    "Name: " + inquiry.name + "\n" +
    "Email: " + inquiry.email + "\n" +
    "Phone: " + (inquiry.phone || "-") + "\n" +
    "Privacy: " + inquiry.privacy + "\n\n" +
    "Message:\n" + inquiry.message + "\n\n" +
    "Sheet: " + spreadsheetUrl;

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: "VELLUNE Contact",
    replyTo: inquiry.email || ADMIN_EMAIL,
  });
}

function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
