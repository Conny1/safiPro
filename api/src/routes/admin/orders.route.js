const express = require("express");
const { validate } = require("../../middlewares/validation");
const { orderValidation } = require("../../validations");
const { orderController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();

route.use(verifyTokens);

route.post(
  "/",
  validate(orderValidation.createOrder),
  orderController.addNewOrder
);

route.post(
  "/findandfilter",
  validate(orderValidation.findandfilter),
  orderController.getOrderByBranchid
);

route.get(
  "/:id",
  validate(orderValidation.getOrderById),
  orderController.getOrderByid
);

route.put(
  "/:id",
  validate(orderValidation.updateOrder),
  orderController.updateOrder
);

route.delete(
  "/:id",
  validate(orderValidation.deleteOrder),
  orderController.deleteOrder
);

module.exports = route;
