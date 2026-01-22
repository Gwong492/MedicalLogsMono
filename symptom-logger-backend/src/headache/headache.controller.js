const data = require("./headache.service");
const { buildSymptomReportPdf } = require("../utils/convertPDF");
const { uploadFileToSlack } = require("../utils/slackUpload");
const { set } = require("../../app");

const setTitle = (req, res) => {
  if (req.body.metadata.exportType === "headache") {
    return "Headache Log";
  } else if (req.body.metadata.exportType === "bloodPressure") {
    return "Blood Pressure Log";
  } else if (req.body.metadata.exportType === "pain") {
    return "Pain Log";
  }
}

const getSymptomData = (req, res) => {
  res.json({ data: data });
};

const sendPDFReport = async (req, res) => {
  console.log("Title", req.body.metadata.exportType);
  const pdfBuffer = await buildSymptomReportPdf(req.body.data.logData, { title: setTitle(req, res) });
  await uploadFileToSlack(pdfBuffer, "headache_report.pdf", req.body.profile.fullName, process.env.SLACK_CHANNEL_ID);
  res.status(200).json({ message: "PDF report sent." });
}

module.exports = {
  getSymptomData,
  sendPDFReport,
};