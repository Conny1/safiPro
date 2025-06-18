const express = require("express");
const adminRoute = require("./admin");
const router = express.Router();

let routes = [
  {
    path: "/admin",
    route: adminRoute,
  },
];

routes.forEach((item) => {
  router.use(item.path, item.route);
});

module.exports = router;
