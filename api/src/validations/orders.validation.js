const Joi = require("joi");
const { objectId } = require("../utils/index");

const createInvoice = {
  body: Joi.object().keys({
    invoice_settings_id: Joi.string().custom(objectId).required(),
    notes: Joi.string(),
    user_id: Joi.string().custom(objectId).required(),
    tax: Joi.number().default(0),
    discount: Joi.number().default(0),
    due_date: Joi.date(),
    status: Joi.string().default("pending"),
    currency: Joi.string(),
    client: Joi.string().custom(objectId).required(),
    items: Joi.array().items(
      Joi.object({
        description: Joi.string().required(),
        quantity: Joi.number().default(1).required(),
        unit_price: Joi.number().required(),
      })
    ),
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

const getInvoiceByid = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateInvoice = {
  body: Joi.object().keys({
    user_id: Joi.string().custom(objectId),

    tax: Joi.number(),
    discount: Joi.number(),
    due_date: Joi.date(),
    status: Joi.string(),
    send_status: Joi.string(),
    paid_amount: Joi.number(),
    type: Joi.string(),
    notes: Joi.string(),
    currency: Joi.string(),
    client: Joi.string().custom(objectId),
    invoice_settings_id: Joi.string().custom(objectId),
    __v: Joi.number(),
    items: Joi.array().items(
      Joi.object({
        description: Joi.string(),
        quantity: Joi.number(),
        unit_price: Joi.number(),
        total: Joi.number(),
        _id: Joi.string().custom(objectId),
      })
    ),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const deleteInvoice = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const invoicesettings = {
  body: Joi.object().keys({
    user_id: Joi.string().custom(objectId),
    company_name: Joi.string().required(),
    address: Joi.string().required(),
    logo: Joi.string(),
  }),
};

const updateInvoiceSett = {
  body: Joi.object().keys({
    company_name: Joi.string(),
    address: Joi.string(),
    logo: Joi.string().allow(null, ""),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createInvoice,
  findandfilter,
  getInvoiceByid,
  updateInvoice,
  deleteInvoice,
  invoicesettings,
  updateInvoiceSett,
};
