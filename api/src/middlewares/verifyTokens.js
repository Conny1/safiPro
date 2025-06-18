var jwt = require("jsonwebtoken");
const { createError } = require("../configs/errorConfig");

const verifyTokens = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return next(createError(400, "Tokens not provided"));
  }

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return next(createError(401, err?.message || "Token expired"));
    }

    req.user = user;
    next();
  });
};

module.exports = {
  verifyTokens,
};
