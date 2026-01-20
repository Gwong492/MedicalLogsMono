const express = require("express");
const cors = require("cors");
const app = express();

const { buildSymptomReportPdf } = require("./src/utils/convertPDF");
const data = require("./src/files/files.service");

const router = require("./src/files/files.router");

const errorHandler = require("./src/errors/errorHandler");
const methodNotAllowed = require("./src/errors/methodNotAllowed");

app.use(cors());
app.use(express.json());

app.use("/files", router);
app.get("/test-pdf", async (req, res) => {
  const pdfBuffer = await buildSymptomReportPdf(data.headacheLog, { title: "Headache Logs" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=test.pdf");
  res.send(pdfBuffer);
});


app.use(methodNotAllowed);
app.use(errorHandler);

module.exports = app;
