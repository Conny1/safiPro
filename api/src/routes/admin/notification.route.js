const express = require("express");
const { verifyTokens } = require("../../middlewares/verifyTokens");
const { notificationController } = require("../../controllers");
const { notificationValidation } = require("../../validations");
const { validate } = require("../../middlewares/validation");

const route = express.Router();

route.post(
  "/reset-password-link-email",
  validate(notificationValidation.resetPasswordlink),
  notificationController.resetPasswordlink
);
route.use(verifyTokens);

module.exports = route;
