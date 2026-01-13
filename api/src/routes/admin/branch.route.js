const express = require("express");
const {
  validate,
  roleValidation,
  subscriptionValidation,
} = require("../../middlewares/validation");
const { branchValidation } = require("../../validations");
const { branchController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();

route.use(verifyTokens);
route.use(subscriptionValidation);

route.post(
  "/",
  roleValidation,
  validate(branchValidation.addNewBranch),
  branchController.addNewBranch
);
route.post(
  "/findandfilter",
  roleValidation,
  validate(branchValidation.findandfilter),
  branchController.findandfilter
);
route.get(
  "/:id",
  roleValidation,
  validate(branchValidation.getBranchByid),
  branchController.getBranchByid
);
route.put(
  "/:id",
  roleValidation,
  validate(branchValidation.updateBranch),
  branchController.updateBranch
);
route.delete(
  "/:id",
  roleValidation,
  validate(branchValidation.deleteBranch),
  branchController.deleteBranch
);

route.get(
  "/list/business/",
  roleValidation,
  branchController.getBranchByBusiness_id
);

module.exports = route;
