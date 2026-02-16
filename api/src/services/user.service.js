const { createError } = require("../configs/errorConfig.js");
const { User, Payment } = require("../models/index.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
// const { getSubscriptionData } = require("./subscriptionService.js");

const createUser = async (body) => {
  let password = body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  body.password = hash;

  try {
    const user = new User(body);
    const currentDate = new Date();
    const expiresAt = new Date(
      currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    ); // 30 days in milliseconds

    const payment = new Payment({
      business_id: new ObjectId(user.business_id),
      amount: 900,
      payment_method: "free",
      payment_status: "free",
      status: "active",
      expires_at: expiresAt,
    });
    await payment.save();
    return await user.save();
  } catch (error) {
    if (error?.errorResponse?.code === 11000) {
      throw createError(400, "Account with that email exists.");
    } else {
      console.log(error);
      throw new Error(error);
    }
  }
};

const adminCreateEmployee = async (body) => {
  let password = body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  body.password = hash;

  try {
    const user = new User({ ...body, subscription: "active" });
    return await user.save();
  } catch (error) {
    if (error?.errorResponse.code === 11000) {
      throw createError(400, "Account with that email exists.");
    } else {
      throw new Error(error);
    }
  }
};

const login = async (body) => {
  const user = await User.findOne({ email: body.email, is_deleted:false });
  if (!user) {
    throw createError(400, "Email with that account does not exist.");
  }
  const isPassword = bcrypt.compareSync(body.password, user.password); // true
  if (!isPassword) {
    throw createError(401, "Incorrect email or password.");
  }
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_KEY
  );
  const { password, ...other } = user._doc;
  other.subscription = { status: user.subscription };
  return { status: 200, data: { token, ...other } };
};

const resetPassword = async (id, body) => {
  let password = body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  let newPassword = hash;

  const user = await User.findByIdAndUpdate(
    new ObjectId(id),
    { $set: { password: newPassword } },
    { new: true }
  );
  return user;
};

const updateUser = async (id, body) => {
  const userData = await User.findOne({ _id: new ObjectId(id) });
  if (!userData) {
    throw createError(400, "Invalid user id");
  }

  const user = await User.findByIdAndUpdate(
    new ObjectId(id),
    { $set: body },
    { new: true }
  );
  const { password, ...other } = user._doc;
  return other;
};

const getauthUser = async (userid) => {
  const user = await User.findById(new ObjectId(userid));

  if (!user) {
    throw createError(404, "user not found!");
  }
  const { password, ...other } = user._doc;
  return { ...other, subscription: { status: user.subscription } };
};

const findandfilter = async (filter, options) => {
  const user = await User.paginate(filter, options);
  if (!user) {
    throw createError(404, "user not found.");
  }
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(new ObjectId(id), {
    $set: { is_deleted: true },
  });

  return user;
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
