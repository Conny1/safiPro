const express = require("express");
const {
  validate,
  roleValidation,
  subscriptionValidation,
} = require("../../middlewares/validation");
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
// require authorisation to access
route.use(verifyTokens);
route.get("/auth-user", userController.getauthUser);

route.use(subscriptionValidation);

route.post(
  "/create-staff",
  roleValidation,
  validate(userValidation.createStaff),
  userController.adminCreateEmployee
);

route.put(
  "/:id",
  roleValidation,
  validate(userValidation.updateUser),
  userController.updateUser
);

route.post(
  "/findandfilter",
  roleValidation,
  validate(userValidation.findandfilter),
  userController.findandfilter
);

route.delete(
  "/:id",
  roleValidation,
  validate(userValidation.deleteBranch),
  userController.deleteUser
);

module.exports = route;
