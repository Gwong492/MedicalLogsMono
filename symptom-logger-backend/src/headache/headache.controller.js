const data = require("./headache.service");
const { buildSymptomReportPdf } = require("../utils/convertPDF");
const { uploadFileToSlack } = require("../utils/slackUpload");

const setTitle = (req, res) => {
  
}

const getSymptomData = (req, res) => {
  res.json({ data: data });
};

const sendPDFReport = async (req, res) => {
  console.log("Title", req.body.metadata.exportType);
  const pdfBuffer = await buildSymptomReportPdf(req.body.data.logData, { title: req.body.metadata.exportType });
  await uploadFileToSlack(pdfBuffer, "headache_report.pdf", req.body.profile.fullName, process.env.SLACK_CHANNEL_ID);
  res.status(200).json({ message: "PDF report sent." });
}

module.exports = {
  getSymptomData,
  sendPDFReport,
};