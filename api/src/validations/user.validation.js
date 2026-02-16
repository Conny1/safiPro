const Joi = require("joi");
const { objectId } = require("../utils");

const createUser = {
  body: Joi.object().keys({
    first_name: Joi.string().required().trim(),
    last_name: Joi.string().required().trim(),
    role: Joi.string()
      .valid("Super Admin", "Admin", "Branch Manager", "Staff")
      .required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain letters, numbers, and a special character.",
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

const createStaff = {
  body: Joi.object().keys({
    first_name: Joi.string().required().trim(),
    last_name: Joi.string().required().trim(),
    role: Joi.string()
      .valid("Super Admin", "Admin", "Branch Manager", "Staff")
      .required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain letters, numbers, and a special character.",
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
    branches: Joi.array().items(
      Joi.object({
        branch_id: Joi.string().custom(objectId).required(),
        role: Joi.string()
          .valid("Super Admin", "Admin", "Branch Manager", "Staff")
          .required(),
      }),
    ),
  }),
};

const login = {
  body: Joi.object().keys({
    password: Joi.string().required(),
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
      .min(8)
      .max(30)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain letters, numbers, and a special character.",
        "string.empty": "Password is required.",
      }),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    first_name: Joi.string().trim(),
    is_deleted: Joi.boolean(),
    last_name: Joi.string().trim(),
    password: Joi.string(),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    __v: Joi.number(),
    branches: Joi.array().items(
      Joi.object({
        branch_id: Joi.string().custom(objectId).required(),
        role: Joi.string()
          .valid("Super Admin", "Admin", "Branch Manager", "Staff")
          .required(),
      }),
    ),
    _id: Joi.string().custom(objectId),
    role: Joi.string().valid("Super Admin", "Admin", "Branch Manager", "Staff"),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const findandfilter = {
  body: Joi.object().keys({
    sortBy: Joi.string().allow("", null).default(""),
    limit: Joi.number().default(10),
    page: Joi.number().default(0),
    search: Joi.string().allow("", null).default(""),
    match_values: Joi.object().allow(null).default(null),
  }),
};

module.exports = {
  createUser,
  login,
  updateUser,
  updateUser,
  resetPassword,
  createStaff,
  findandfilter,
};
