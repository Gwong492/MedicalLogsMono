const { buildSymptomReportPdf } = require("../utils/convertPDF");
const { uploadFileToSlack } = require("../utils/slackUpload");

const sendPDFReport = async (req, res) => {
  const pdfBuffer = await buildSymptomReportPdf(req.body.data.logData, { title: setTitle(req, res) });
  await uploadFileToSlack(pdfBuffer, "headache_report.pdf", req.body.profile.fullName, process.env.SLACK_CHANNEL_ID);
  res.status(200).json({ message: "PDF report sent." });
}