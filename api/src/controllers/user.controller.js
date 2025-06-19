const { createError } = require("../configs/errorConfig");
const { userService } = require("../services");
const createUser = async (req, resp, next) => {
  try {
    const user = await userService.createUser(req.body);
    // add notification config
    // await subscriptionService.createSubscription({
    //   userId: user._id,
    //   app: "invoice",
    //   packageType: "free",
    // });
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
  console.log("here");
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
  console.log(req.user._id);
  try {
    const user = await userService.getauthUser(req.user._id);
    resp.status(200).json({ status: 200, data: user });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

module.exports = { createUser, login, updateUser, resetPassword, getauthUser };
