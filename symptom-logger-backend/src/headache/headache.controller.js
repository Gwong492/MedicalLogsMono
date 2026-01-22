const data = require("./headache.service");
const { buildSymptomReportPdf } = require("../utils/convertPDF");
const { uploadFileToSlack } = require("../utils/slackUpload");

const getSymptomData = (req, res) => {
  res.json({ data: data });
};

const sendPDFReport = async (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "Data logged." });
  // const pdfBuffer = await buildSymptomReportPdf(data.headacheLog, { title: "Headache Logs" });
  // await uploadFileToSlack(pdfBuffer, "headache_report.pdf", process.env.SLACK_CHANNEL_ID);
  // res.status(200).json({ message: "PDF report sent." });
}

module.exports = {
  getSymptomData,
  sendPDFReport,
};