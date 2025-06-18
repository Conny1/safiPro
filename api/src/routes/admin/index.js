const express = require("express");
const orderRoute = require("./orders.route");
const branchRoute = require("./branch.route");
const userRoute = require("./user.route");

const router = express.Router();

let routes = [
  {
    path: "/orders",
    route: orderRoute,
  },
  {
    path: "/branch",
    route: branchRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

module.exports = router;
