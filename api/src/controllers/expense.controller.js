const { createError } = require("../configs/errorConfig");
const { pick } = require("../middlewares/validation");
const { expenseService } = require("../services");
const ObjectId = require("mongoose").Types.ObjectId;

const addNewexpense = async (req, resp, next) => {
  try {
    const expense = await expenseService.addNewexpense({ business_id:req.user.business_id, ...req.body});
    resp
      .status(200)
      .json({ status: 200, data: { message: "New expense added" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const updateexpense = async (req, resp, next) => {
  try {
    const expense = await expenseService.updateexpense(req.params.id, req.body);
    resp.status(200).json({ status: 200, expense });
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
          description: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
    
      ];
    }

    const expense = await expenseService.findandfilter(filter, options);

    resp.status(200).json({ status: 200, data: expense });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const getexpenseByid = async (req, resp, next) => {
  try {
    const expense = await expenseService.getexpenseByid(req.params.id);
    resp.status(200).json({ status: 200, data: expense });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const deleteexpense = async (req, resp, next) => {
  try {
    await expenseService.deleteexpense(req.params.id);
    resp
      .status(200)
      .json({ status: 200, data: { message: "expense has been deleted" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

module.exports = {
  addNewexpense,
  updateexpense,
  deleteexpense,
  getexpenseByid,
  findandfilter,
};
