const express = require("express");
const {
  validate,
  roleValidation,
  subscriptionValidation,
} = require("../../middlewares/validation");
const {  analysisValidation } = require("../../validations");
const {  analysisController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();
route.use(verifyTokens);
route.use(subscriptionValidation);


route.get(
  "/complete",
  roleValidation,
  validate(analysisValidation.completAnalysis ),
   analysisController.getCompleteAnalysisData
);

module.exports = route;
