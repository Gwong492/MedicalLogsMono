const express = require("express");
const cors = require("cors");
const app = express();

const { buildSymptomReportPdf } = require("./src/utils/convertPDF");
const data = require("./src/headache/headache.service");

const router = require("./src/headache/headache.router");

const errorHandler = require("./src/errors/errorHandler");
const methodNotAllowed = require("./src/errors/methodNotAllowed");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("INCOMING:", req.method, req.url);
  next();
});
app.use("/headache", router);
app.get("/health", (req, res) => res.json({ ok: true }));
// app.use("/pain", router);
// app.use("/blood-pressure", router);
app.get("/test-pdf", async (req, res) => {
  const pdfBuffer = await buildSymptomReportPdf(data.headacheLog, { title: "Headache Logs" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=test.pdf");
  res.send(pdfBuffer);
});


app.use(methodNotAllowed);
app.use(errorHandler);

module.exports = app;
