const { createError } = require("../configs/errorConfig");
const { pick } = require("../middlewares/validation");
const { User } = require("../models");
const { notificationService } = require("../services");
const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");

// Add New Notification Settings
const createNotification = async (req, resp, next) => {
  try {
    await notificationService.createNotification(req.body);
    resp.status(200).json({ status: 200, data: { message: "Notification" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const resetPasswordlink = async (req, resp, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) next(createError(401, "Invalid email account"));
    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" } // token valid for 1 hour
    );
    let reset_link = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await notificationService.resetPasswordlink(user.email, {
      user_name: `${user.first_name} ${user.last_name}`,
      reset_link,
      user_id: user._id,
    });

    resp.status(200).json({ status: 200, data: { success: true } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

module.exports = {
  createNotification,
  resetPasswordlink,
};
