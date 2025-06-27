const express = require("express");
const { validate, roleValidation } = require("../../middlewares/validation");
const { paymentValidation } = require("../../validations");
const { paymentController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();
// Create a new payment
route.post("/webhook", paymentController.createPayment);
route.use(verifyTokens);

// Find and filter payments
route.post(
  "/findandfilter",
  roleValidation,
  validate(paymentValidation.findandfilter),
  paymentController.findAndFilterPayments
);

// make payments - mobile money
route.post(
  "/mobile/money",
  roleValidation,
  validate(paymentValidation.mobileMoneyPayment),
  paymentController.mobileMoneyPayment
);

module.exports = route;
