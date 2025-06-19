const Joi = require("joi");
const { objectId } = require("../utils");

const addNewBranch = {
  body: Joi.object().keys({
    user_id: Joi.string().custom(objectId).required(),
    name: Joi.string().lowercase().required(),
    location: Joi.string().lowercase().default("").allow(null),
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

const getBranchByid = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateBranch = {
  body: Joi.object().keys({
    name: Joi.string().lowercase(),
    location: Joi.string().lowercase(),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const deleteBranch = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  addNewBranch,
  deleteBranch,
  getBranchByid,
  findandfilter,
  updateBranch,
};
