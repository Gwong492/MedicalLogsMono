// pdf/report.js
// npm i pdfkit
// Generates a PDF (Buffer) from an array of log objects.
// The returned Buffer can be emailed (SendGrid) or uploaded to Slack (files.uploadV2).

import PDFDocument from "pdfkit";

/**
 * @typedef {Object} HeadacheLog
 * @property {string} startDateTime
 * @property {number} durationMinutes
 * @property {number} intensity
 * @property {string[]} symptoms
 * @property {string[]} triggers
 * @property {string[]} medications
 * @property {boolean} requiredLyingDown
 * @property {boolean} missedWork
 * @property {string} notes
 */

/**
 * @typedef {Object} PainLog
 * @property {string} dateTime
 * @property {number} painLevel
 * @property {string} bodyRegion
 * @property {string} painType
 * @property {number} durationMinutes
 * @property {string[]} triggers
 * @property {string[]} medications
 * @property {number} reliefPercent
 * @property {{sleep:boolean,work:boolean,walking:boolean,lifting:boolean}} functionalImpact
 * @property {string} notes
 */

/**
 * @typedef {Object} BPLog
 * @property {string} dateTime
 * @property {number} systolic
 * @property {number} diastolic
 * @property {number} [pulse]
 * @property {string} posture
 * @property {string} armUsed
 * @property {string} deviceType
 * @property {string} notes
 */

/**
 * @typedef {"headache"|"pain"|"bloodPressure"} ReportType
 */

/**
 * @typedef {Object} BuildOptions
 * @property {string} [title]  // Used as BOTH the visible title and the format selector.
 */

/**
 * @typedef {HeadacheLog|PainLog|BPLog} SymptomLog
 */

/**
 * Generate a PDF as a Buffer (no filesystem needed).
 * `options.title` is used both:
 *  1) as the visible document title, AND
 *  2) to select the report type by keyword matching (headache|pain|blood pressure|bp).
 *
 * Examples:
 *  - { title: "Headache Log" } => headache format
 *  - { title: "Pain Log" } => pain format
 *  - { title: "Blood Pressure" } or { title: "BP Log" } => bloodPressure format
 *
 * @param {SymptomLog[]} logs
 * @param {BuildOptions} [options]
 * @returns {Promise<Buffer>}
 */
export function buildSymptomReportPdf(logs, options = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: "LETTER", layout: "landscape" });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const rawTitle = typeof options.title === "string" ? options.title : "Symptom Report";
    const reportType = inferReportType(rawTitle);

    // ---------- Header ----------
    doc.font("Helvetica-Bold").fontSize(18).text(rawTitle);
    doc.moveDown(0.25);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("gray")
      .text(`Generated: ${new Date().toLocaleString()}`);
    doc.fillColor("black");
    doc.moveDown(1);

    // ---------- Page metrics ----------
    const pageLeft = doc.page.margins.left;
    const pageRight = doc.page.width - doc.page.margins.right;
    const pageBottom = doc.page.height - doc.page.margins.bottom;

    const rowPadding = 6;

    function ensureNewPage(minHeightNeeded) {
      if (doc.y + minHeightNeeded > pageBottom) {
        doc.addPage();
        drawHeaderRow();
      }
    }

    function rowHeight(cells, colWidths) {
      doc.fontSize(9);
      let maxH = 0;
      for (let i = 0; i < cells.length; i++) {
        const h = doc.heightOfString(String(cells[i] ?? ""), {
          width: colWidths[i] - 6,
        });
        if (h > maxH) maxH = h;
      }
      return Math.max(18, maxH + rowPadding);
    }

    function drawHeaderRow(headers, colWidths) {
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

    function drawRow(cells, colWidths) {
      const h = rowHeight(cells, colWidths);
      ensureNewPage(h + 4);

      const y = doc.y;
      let x = pageLeft;

      for (let i = 0; i < cells.length; i++) {
        doc.rect(x, y, colWidths[i], h).stroke();
        doc.text(String(cells[i] ?? ""), x + 3, y + 3, {
          width: colWidths[i] - 6,
        });
        x += colWidths[i];
      }

      doc.y = y + h;
    }

    // ---------- Resolve columns by report type ----------
    const spec = getReportSpec(reportType);

    // ---------- Render table ----------
    drawHeaderRow(spec.headers, spec.colWidths);

    const safeLogs = Array.isArray(logs) ? logs : [];
    if (safeLogs.length === 0) {
      doc.text("No records provided.");
      doc.end();
      return;
    }

    for (const log of safeLogs) {
      const row = spec.toRow(log);
      drawRow(row, spec.colWidths);
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

/* ----------------------------- helpers ----------------------------- */

/**
 * Infer report type from the title string.
 * @param {string} title
 * @returns {ReportType}
 */
function inferReportType(title) {
  const t = String(title || "").toLowerCase();

  if (t.includes("headache") || t.includes("migraine")) return "headache";
  if (t.includes("blood pressure") || t.includes("bloodpressure") || t.includes("bp")) return "bloodPressure";
  if (t.includes("pain")) return "pain";

  return "headache";
}

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function safeStr(v) {
  return typeof v === "string" ? v : "";
}

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function safeBool(v) {
  return typeof v === "boolean" ? v : false;
}

function formatDateTime(iso) {
  const s = safeStr(iso);
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleString();
}

function formatMinutes(mins) {
  const n = safeNum(mins);
  if (n === null) return "";
  if (n < 60) return `${n} min`;
  const h = Math.floor(n / 60);
  const m = n % 60;
  if (m === 0) return `${h} hr${h === 1 ? "" : "s"}`;
  return `${h} hr${h === 1 ? "" : "s"} ${m} min`;
}

/**
 * @param {{sleep:boolean,work:boolean,walking:boolean,lifting:boolean}} fi
 * @returns {string}
 */
function formatFunctionalImpact(fi) {
  const v = fi && typeof fi === "object" ? fi : {};
  const parts = [];
  if (v.sleep) parts.push("Sleep");
  if (v.work) parts.push("Work");
  if (v.walking) parts.push("Walking");
  if (v.lifting) parts.push("Lifting");
  return parts.length ? parts.join(", ") : "";
}

/**
 * Returns header/width mapping + row converter per report type.
 * @param {ReportType} type
 */
function getReportSpec(type) {
  /** @type {{ headers: string[], colWidths: number[], toRow: (log: any) => string[] }} */
  let spec;

  if (type === "headache") {
    spec = {
      headers: [
        "Start",
        "Duration",
        "Intensity",
        "Symptoms",
        "Triggers",
        "Meds",
        "Lying Down",
        "Missed Work",
        "Notes",
      ],
      // Must total <= printable width; these fit LETTER with margin 40
      colWidths: [88, 55, 50, 90, 85, 70, 55, 65, 110],
      toRow: (log) => {
        const start = formatDateTime(log?.startDateTime);
        const duration = formatMinutes(log?.durationMinutes);
        const intensity = safeNum(log?.intensity);
        const symptoms = safeArr(log?.symptoms).join(", ");
        const triggers = safeArr(log?.triggers).join(", ");
        const meds = safeArr(log?.medications).join(", ");
        const lyingDown = safeBool(log?.requiredLyingDown) ? "Yes" : "No";
        const missedWork = safeBool(log?.missedWork) ? "Yes" : "No";
        const notes = safeStr(log?.notes);

        return [
          start,
          duration,
          intensity === null ? "" : String(intensity),
          symptoms,
          triggers,
          meds,
          lyingDown,
          missedWork,
          notes,
        ];
      },
    };
  } else if (type === "pain") {
    spec = {
      headers: [
        "Date/Time",
        "Pain",
        "Region",
        "Type",
        "Duration",
        "Triggers",
        "Meds",
        "Relief %",
        "Impact",
        "Notes",
      ],
      colWidths: [88, 40, 70, 55, 55, 80, 70, 55, 65, 102],
      toRow: (log) => {
        const dt = formatDateTime(log?.dateTime);
        const painLevel = safeNum(log?.painLevel);
        const region = safeStr(log?.bodyRegion);
        const painType = safeStr(log?.painType);
        const duration = formatMinutes(log?.durationMinutes);
        const triggers = safeArr(log?.triggers).join(", ");
        const meds = safeArr(log?.medications).join(", ");
        const relief = safeNum(log?.reliefPercent);
        const impact = formatFunctionalImpact(log?.functionalImpact);
        const notes = safeStr(log?.notes);

        return [
          dt,
          painLevel === null ? "" : String(painLevel),
          region,
          painType,
          duration,
          triggers,
          meds,
          relief === null ? "" : String(relief),
          impact,
          notes,
        ];
      },
    };
  } else {
    // bloodPressure
    spec = {
      headers: ["Date/Time", "Systolic", "Diastolic", "Pulse", "Posture", "Arm", "Device", "Notes"],
      colWidths: [110, 55, 55, 45, 60, 45, 85, 155],
      toRow: (log) => {
        const dt = formatDateTime(log?.dateTime);
        const sys = safeNum(log?.systolic);
        const dia = safeNum(log?.diastolic);
        const pulse = safeNum(log?.pulse);
        const posture = safeStr(log?.posture);
        const arm = safeStr(log?.armUsed);
        const device = safeStr(log?.deviceType);
        const notes = safeStr(log?.notes);

        return [
          dt,
          sys === null ? "" : String(sys),
          dia === null ? "" : String(dia),
          pulse === null ? "" : String(pulse),
          posture,
          arm,
          device,
          notes,
        ];
      },
    };
  }

  return spec;
}
