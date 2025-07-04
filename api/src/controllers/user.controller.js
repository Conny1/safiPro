const { createError } = require("../configs/errorConfig");
const { pick } = require("../middlewares/validation");
const { userService } = require("../services");
const ObjectId = require("mongoose").Types.ObjectId;

const createUser = async (req, resp, next) => {
  try {
    const user = await userService.createUser(req.body);
    resp
      .status(200)
      .json({ status: 200, data: { message: "New account created" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const adminCreateEmployee = async (req, resp, next) => {
  try {
    const user = await userService.adminCreateEmployee(req.body);

    resp
      .status(200)
      .json({ status: 200, data: { message: "New account created" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const login = async (req, resp, next) => {
  try {
    const user = await userService.login(req.body);
    resp.status(200).json(user);
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const updateUser = async (req, resp, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    resp.status(200).json({ status: 200, data: user });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};
const resetPassword = async (req, resp, next) => {
  try {
    const user = await userService.resetPassword(req.user._id, req.body);

    resp.status(200).json({
      status: 200,
      data: { success: true, message: "password reset" },
    });
  } catch (error) {
    console.log(error);
    return next(createError(error.status || 500, error.message));
  }
};

const getauthUser = async (req, resp, next) => {
  try {
    const user = await userService.getauthUser(req.user._id);
    console.log(user);

    resp
      .set("Cache-Control", "no-store")
      .status(200)
      .json({ status: 200, data: user });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const findandfilter = async (req, resp, next) => {
  try {
    let filter = { is_deleted: false };

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

    const user = await userService.findandfilter(filter, options);

    resp.status(200).json({ status: 200, data: user });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const deleteUser = async (req, resp, next) => {
  try {
    await userService.deleteUser(req.params.id);
    resp
      .status(200)
      .json({ status: 200, data: { message: "User has been deleted" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};
module.exports = {
  createUser,
  login,
  updateUser,
  resetPassword,
  getauthUser,
  adminCreateEmployee,
  findandfilter,
  deleteUser,
};
