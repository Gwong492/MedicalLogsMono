const data = require("./headache.service");
const { buildSymptomReportPdf } = require("../utils/convertPDF");
const { uploadFileToSlack } = require("../utils/slackUpload");

const getSymptomData = (req, res) => {
  res.json({ data: data });
};

const sendPDFReport = async (req, res) => {
  console.log(req.body.logData);
  const pdfBuffer = await buildSymptomReportPdf(data.logData, { title: req.body.metadata.exportType });
  await uploadFileToSlack(pdfBuffer, "headache_report.pdf", process.env.SLACK_CHANNEL_ID);
  res.status(200).json({ message: "PDF report sent." });
}

module.exports = {
  getSymptomData,
  sendPDFReport,
};