const Joi = require("joi");
const { objectId } = require("../utils/index");

const completAnalysis = {
  query: Joi.object().keys({
    branchId: Joi.string().allow(""),
    dateFilter: Joi.string().required().default("thisMonth"),
    customStart: Joi.string().allow(""),
    customEnd: Joi.string().allow(""),
  }),
};

module.exports = {
  completAnalysis
};
