/**
 * VELLUNE Google Apps Script
 *
 * Setup:
 * 1. Create a Google Spreadsheet named "VELLUNE_INQUIRIES"
 * 2. Add sheet "INQUIRIES" with headers:
 *    ID | DATE | TYPE | COMPANY | NAME | EMAIL | PHONE | MESSAGE | PRIVACY | STATUS
 * 3. Extensions > Apps Script > paste this file
 * 4. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy deployment URL to GOOGLE_SCRIPT_URL in .env.local
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName("INQUIRIES");

    // INQUIRIES 탭이 없으면 첫 번째 시트 사용
    if (!sheet) {
      sheet = spreadsheet.getSheets()[0];
    }

    if (!sheet) {
      return createResponse({ success: false, error: "No sheet found in spreadsheet." });
    }

    const lastRow = sheet.getLastRow();
    const nextNumber = Math.max(lastRow, 1);
    const inquiryId = "VL-" + String(nextNumber).padStart(3, "0");

    sheet.appendRow([
      inquiryId,
      new Date(),
      data.type || "",
      data.company || "",
      data.name || "",
      data.email || "",
      data.phone || "",
      data.message || "",
      data.privacy || "NO",
      "NEW",
    ]);

    return createResponse({ success: true, id: inquiryId });
  } catch (error) {
    return createResponse({
      success: false,
      error: error && error.message ? error.message : "Unknown error",
    });
  }
}

function doGet() {
  return createResponse({ success: true, message: "VELLUNE contact endpoint ready." });
}

function createResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
