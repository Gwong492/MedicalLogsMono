// pdf/report.js
// npm i pdfkit
// This file generates a PDF (Buffer) from an array of log objects.
// The returned Buffer can be emailed (SendGrid) or uploaded to Slack (files.uploadV2).

import PDFDocument from "pdfkit";

/**
 * @typedef {Object} SymptomLog
 * @property {string} date
 * @property {number} intensity
 * @property {string[]} symptom
 * @property {string[]} triggers
 * @property {string[]} medicationTaken
 * @property {string[]} reliefRequired
 * @property {string} notes
 */

/**
 * Generate a PDF as a Buffer (no filesystem needed).
 * @param {SymptomLog[]} logs
 * @param {{ title?: string }} [options]
 * @returns {Promise<Buffer>}
 */
export function buildSymptomReportPdf(logs, options = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "LETTER" });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const title = options.title ?? "Symptom Report";

    // ---------- Header ----------
    doc.font("Helvetica-Bold").fontSize(18).text(title);
    doc.moveDown(0.25);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("gray")
      .text(`Generated: ${new Date().toLocaleString()}`);
    doc.fillColor("black");
    doc.moveDown(1);

    // ---------- Table setup ----------
    const headers = ["Date", "Intensity", "Symptoms", "Triggers", "Meds", "Relief", "Notes"];
    const colWidths = [75, 50, 85, 85, 65, 75, 120];
    const rowPadding = 6;

    const pageLeft = doc.page.margins.left;
    const pageRight = doc.page.width - doc.page.margins.right;
    const pageBottom = doc.page.height - doc.page.margins.bottom;

    function ensureNewPage(minHeightNeeded) {
      if (doc.y + minHeightNeeded > pageBottom) {
        doc.addPage();
        drawHeaderRow();
      }
    }

    function drawHeaderRow() {
      ensureNewPage(24);
      const y = doc.y;
      let x = pageLeft;

      doc.font("Helvetica-Bold").fontSize(10);
      for (let i = 0; i < headers.length; i++) {
        doc.rect(x, y, colWidths[i], 18).stroke();
        doc.text(headers[i], x + 3, y + 4, { width: colWidths[i] - 6 });
        x += colWidths[i];
      }

      doc.moveDown(1.2);
      doc.font("Helvetica").fontSize(9);
    }

    function normalize(log) {
      const safeArr = (v) => (Array.isArray(v) ? v : []);
      const safeStr = (v) => (typeof v === "string" ? v : "");

      return {
        date: safeStr(log.date),
        intensity: Number.isFinite(log.intensity) ? String(log.intensity) : "",
        symptom: safeArr(log.symptom).join(", "),
        triggers: safeArr(log.triggers).join(", "),
        medicationTaken: safeArr(log.medicationTaken).join(", "),
        reliefRequired: safeArr(log.reliefRequired).join(", "),
        notes: safeStr(log.notes),
      };
    }

    function rowHeight(cells) {
      // Determine the tallest cell based on wrapped text height.
      // Keep it simple: use doc.heightOfString for each cell.
      const fontSize = 9;
      doc.fontSize(fontSize);

      let maxH = 0;
      for (let i = 0; i < cells.length; i++) {
        const h = doc.heightOfString(cells[i] ?? "", {
          width: colWidths[i] - 6,
        });
        if (h > maxH) maxH = h;
      }
      return Math.max(18, maxH + rowPadding);
    }

    function drawRow(cells) {
      const h = rowHeight(cells);
      ensureNewPage(h + 4);

      const y = doc.y;
      let x = pageLeft;

      for (let i = 0; i < cells.length; i++) {
        doc.rect(x, y, colWidths[i], h).stroke();
        doc.text(cells[i] ?? "", x + 3, y + 3, {
          width: colWidths[i] - 6,
        });
        x += colWidths[i];
      }

      doc.y = y + h;
    }

    // ---------- Render table ----------
    drawHeaderRow();

    const safeLogs = Array.isArray(logs) ? logs : [];
    if (safeLogs.length === 0) {
      doc.text("No records provided.");
      doc.end();
      return;
    }

    for (const log of safeLogs) {
      const n = normalize(log);
      drawRow([
        n.date,
        n.intensity,
        n.symptom,
        n.triggers,
        n.medicationTaken,
        n.reliefRequired,
        n.notes,
      ]);
      doc.moveDown(0.2);
    }

    // Optional footer note
    doc.moveDown(1);
    doc
      .fontSize(9)
      .fillColor("gray")
      .text("End of report.", pageLeft, doc.y, { width: pageRight - pageLeft });
    doc.fillColor("black");

    doc.end();
  });
}

/**
 * Convenience: convert PDF Buffer to base64 (for SendGrid attachment).
 * @param {Buffer} pdfBuffer
 * @returns {string}
 */
export function pdfBufferToBase64(pdfBuffer) {
  return pdfBuffer.toString("base64");
}
