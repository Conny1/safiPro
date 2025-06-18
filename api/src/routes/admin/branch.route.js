const express = require("express");
const { validate } = require("../../middlewares/validation");
const { branchValidation } = require("../../validations");
const { branchController } = require("../../controllers");
const { verifyTokens } = require("../../middlewares/verifyTokens");

const route = express.Router();

route.use(verifyTokens);

route.post(
  "/",
  validate(branchValidation.addNewBranch),
  branchController.addNewBranch
);
route.post(
  "/findandfilter",
  validate(branchValidation.findandfilter),
  branchController.getBranchByUserid
);
route.get(
  "/:id",
  validate(branchValidation.getBranchByid),
  branchController.getBranchByid
);
route.put(
  "/:id",
  validate(branchValidation.updateBranch),
  branchController.updateBranch
);
route.delete(
  "/:id",
  validate(branchValidation.deleteBranch),
  branchController.deleteBranch
);

module.exports = route;
