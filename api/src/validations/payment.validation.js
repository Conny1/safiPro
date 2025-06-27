const Joi = require("joi");
const { objectId } = require("../utils");

const findandfilter = {
  body: Joi.object().keys({
    sortBy: Joi.string().allow("", null).default(""),
    limit: Joi.number().default(10),
    page: Joi.number().default(0),
    search: Joi.string().allow("", null).default(""),
    match_values: Joi.object().allow(null).default(null),
  }),
};

const mobileMoneyPayment = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    amount: Joi.number().required(),
    user_id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  findandfilter,
  mobileMoneyPayment,
};
