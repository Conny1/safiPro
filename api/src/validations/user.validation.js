const Joi = require("joi");
const { objectId } = require("../utils/index");

const createUser = {
  body: Joi.object().keys({
    first_name: Joi.string().alphanum().required(),
    last_name: Joi.string().alphanum().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must be alphanumeric and between 3 to 30 characters.",
        "string.empty": "Password is required.",
      }),
    repeat_password: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "any.only": "Passwords do not match.", // Custom error message for mismatch
        "string.empty": "Repeat password is required.",
      }),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    first_name: Joi.string().alphanum(),

    last_name: Joi.string().alphanum(),
    password: Joi.string(),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    __v: Joi.number(),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const authuser = {
  params: Joi.object().keys({
    app: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  login,
  updateUser,
  updateUser,
  resetPassword,
  authuser,
};
