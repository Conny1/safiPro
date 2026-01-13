const Joi = require("joi");
const { objectId } = require("../utils");

const addNewExpense = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    amount: Joi.number().required(),
    date: Joi.string().required(),
    category: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    notes:Joi.string().allow(null, "")
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

const getExpenseByid = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateExpense = {
  body: Joi.object().keys({
        description: Joi.string(),
    amount: Joi.number(),
    date: Joi.string(),
    category: Joi.string(),
    paymentMethod: Joi.string(),
    notes:Joi.string().allow(null, ""),
    business_id: Joi.string().custom(objectId),
    _id: Joi.string().custom(objectId),
    __v: Joi.number().optional(),
    is_deleted: Joi.boolean(),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const deleteExpense = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};



module.exports = {
  addNewExpense,
  deleteExpense,
  getExpenseByid,
  findandfilter,
  updateExpense,
};
