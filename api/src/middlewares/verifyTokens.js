var jwt = require("jsonwebtoken");
const { createError } = require("../configs/errorConfig");
const { User } = require("../models");
const { ObjectId } = require("mongodb");


const verifyTokens = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return next(createError(400, "Tokens not provided"));
  }

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
    if (err) {
      return next(createError(401, err?.message || "Token expired"));
    }
      const userData = await User.findOne({ _id: new ObjectId(user._id) , is_deleted:false});
      if (!userData) {
        throw createError(400, "Invalid.Cannot proceed");
      }
    req.user = userData;
    next();
  });
};

module.exports = {
  verifyTokens,
};
