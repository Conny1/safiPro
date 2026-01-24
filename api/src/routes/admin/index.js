const express = require("express");
const orderRoute = require("./orders.route");
const branchRoute = require("./branch.route");
const userRoute = require("./user.route");
const paymentRoute = require("./payment.route");
const notificationRoute = require("./notification.route");
const expenseRoute = require("./expense.route");
const analysisRoute = require("./analysis.route");

const router = express.Router();

let routes = [
  {
    path: "/orders",
    route: orderRoute,
  },
    {
    path: "/expense",
    route: expenseRoute,
  },
  {
    path: "/branch",
    route: branchRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
    {
    path: "/analysis",
    route: analysisRoute,
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

module.exports = router;
