const { createError } = require("../configs/errorConfig");
const { pick } = require("../middlewares/validation");
const { branchService } = require("../services");
const ObjectId = require("mongoose").Types.ObjectId;

const addNewBranch = async (req, resp, next) => {
  try {
    const branch = await branchService.addNewBranch({ business_id:req.user.business_id, ...req.body});
    resp
      .status(200)
      .json({ status: 200, data: { message: "New branch added" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const updateBranch = async (req, resp, next) => {
  try {
    const branch = await branchService.updateBranch(req.params.id, req.body);
    resp.status(200).json({ status: 200, branch });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const findandfilter = async (req, resp, next) => {
  try {
    let filter = { is_deleted: false, business_id:req.user.business_id};

    for (key in req.body.match_values) {
      if (req.body.match_values[key] || req.body.match_values[key] === "") {
        filter[key] = req.body.match_values[key];
      }
      if (ObjectId.isValid(req.body.match_values[key]))
        filter[key] = new ObjectId(req.body.match_values[key]);
      else if (Array.isArray(req.body.match_values[key]))
        filter[key] = { $in: req.body.match_values[key] };
    }
    const options = pick(req.body, ["sortBy", "limit", "page"]);
    if (req.body?.search) {
      filter["$or"] = [
        {
          name: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
        {
          email: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
      ];
    }

    const branch = await branchService.findandfilter(filter, options);

    resp.status(200).json({ status: 200, data: branch });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const getBranchByBusiness_id = async (req, resp, next) => {
  try {
    const branch = await branchService.getBranchByBusiness_id(req.user.business_id);

    resp.status(200).json({ status: 200, data: branch });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const getBranchByid = async (req, resp, next) => {
  try {
    const branch = await branchService.getBranchByid(req.params.id);
    resp.status(200).json({ status: 200, data: branch });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const deleteBranch = async (req, resp, next) => {
  try {
    await branchService.deleteBranch(req.params.id);
    resp
      .status(200)
      .json({ status: 200, data: { message: "Branch has been deleted" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

module.exports = {
  addNewBranch,
  updateBranch,
  deleteBranch,
  getBranchByBusiness_id,
  getBranchByid,
  findandfilter,
};
