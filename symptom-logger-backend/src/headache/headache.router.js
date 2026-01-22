const router = require("express").Router();
const controller = require("./headache.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router
  .route("/")
  .get(cors(), controller.getSymptomData)
  .post(cors(), controller.sendPDFReport)
  .all(methodNotAllowed);

module.exports = router;

