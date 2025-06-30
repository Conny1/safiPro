const express = require("express");
const { validate, roleValidation } = require("../../middlewares/validation");
const { orderValidation } = require("../../validations");
const { orderController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();

route.use(verifyTokens);

route.post(
  "/",
  roleValidation,
  validate(orderValidation.createOrder),
  orderController.addNewOrder
);

route.post(
  "/findandfilter",
  roleValidation,
  validate(orderValidation.findandfilter),
  orderController.getOrderByBranchid
);

route.get(
  "/:id",
  roleValidation,
  validate(orderValidation.getOrderById),
  orderController.getOrderByid
);

route.put(
  "/:id",
  roleValidation,
  validate(orderValidation.updateOrder),
  orderController.updateOrder
);

route.delete(
  "/:id",
  roleValidation,
  validate(orderValidation.deleteOrder),
  orderController.deleteOrder
);

route.get(
  "/dashboard/:id",
  roleValidation,
  validate(orderValidation.getOrderById),
  orderController.dashboardanalysis
);

module.exports = route;
