const express = require("express");
const {
  validate,
  roleValidation,
  subscriptionValidation,
} = require("../../middlewares/validation");
const { orderValidation } = require("../../validations");
const { orderController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();

// background sync api

route.post(
  "/sync",
  validate(orderValidation.createOrder),
  orderController.addNewOrder
);


route.use(verifyTokens);
route.use(subscriptionValidation);

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


route.patch(
  "/delete/item/:id",
  roleValidation,
  validate(orderValidation.deleteOrderItem),
  orderController.deleteOrderItem
);

module.exports = route;
