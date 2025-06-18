const express = require("express");
const { validate } = require("../../middlewares/validation");
const { userValidation } = require("../../validations");
const { userController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();

route.post(
  "/signup",
  validate(userValidation.createUser),
  userController.createUser
);
route.post(
  "/reset-password",
  verifyTokens,
  validate(userValidation.resetPassword),
  userController.resetPassword
);

route.post("/login", validate(userValidation.login), userController.login);
route.use(verifyTokens);
route.put(
  "/:id",
  validate(userValidation.updateUser),
  userController.updateUser
);

route.get(
  "/auth-user/:app",
  validate(userValidation.authuser),
  userController.getauthUser
);

module.exports = route;
