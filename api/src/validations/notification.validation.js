const Joi = require("joi");
const { objectId } = require("../utils");

const resetPasswordlink = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  resetPasswordlink,
};
