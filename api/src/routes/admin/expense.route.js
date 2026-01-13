const express = require("express");
const {
  validate,
  roleValidation,
  subscriptionValidation,
} = require("../../middlewares/validation");
const { expenseValidation } = require("../../validations");
const { expenseController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();

route.use(verifyTokens);
route.use(subscriptionValidation);

route.post(
  "/",
  roleValidation,
  validate(expenseValidation.addNewExpense),
  expenseController.addNewexpense
);
route.post(
  "/findandfilter",
  roleValidation,
  validate(expenseValidation.findandfilter),
  expenseController.findandfilter
);
route.get(
  "/:id",
  roleValidation,
  validate(expenseValidation.getExpenseByid),
  expenseController.getexpenseByid
);
route.put(
  "/:id",
  roleValidation,
  validate(expenseValidation.updateExpense),
  expenseController.updateexpense
);
route.delete(
  "/:id",
  roleValidation,
  validate(expenseValidation.deleteExpense),
  expenseController.deleteexpense
);



module.exports = route;
