const Joi = require("joi");
const { objectId } = require("../utils/index");

const createOrder = {
  body: Joi.object().keys({
    // order_no: Joi.string().optional(),
    branch_id: Joi.custom(objectId).required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    delivery_method: Joi.string()
      .valid("Pickup", "Customer drop-off")
      .required(),
    items_description: Joi.string().default("").allow("", null),
    service_type: Joi.string()
      .valid(
        "Wash Only",
        "Dry Cleaning",
        "Ironing",
        "Wash & Fold",
        "Full Service",
        "Wash & Iron"
      )
      .required(),

    pickup_date: Joi.string().required(),
    order_date: Joi.string().optional(),
    amount: Joi.number().required(),
    currency: Joi.string().default("KES"),
    payment_status: Joi.string().valid("pending", "paid").required(),
    payment_method: Joi.string().valid("cash", "M-Pesa", "card").required(),

    status: Joi.string()
      .valid("pending", "in-progress", "completed")
      .required(),

    is_completed: Joi.boolean().default(false),
    notes: Joi.string().allow("", null),
  }),
};

const getOrderById = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(), // Use .custom(objectId) if using MongoDB
  }),
};

const updateOrder = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone_number: Joi.string(),

    delivery_method: Joi.string().valid("Pickup", "Customer drop-off"),

    items_description: Joi.string(),

    service_type: Joi.string().valid(
      "Wash Only",
      "Dry Cleaning",
      "Ironing",
      "Wash & Fold",
      "Full Service",
      "Wash & Iron"
    ),

    pickup_date: Joi.string(),
    order_date: Joi.string(),
    amount: Joi.number(),
    payment_status: Joi.string().valid("pending", "paid"),
    payment_method: Joi.string().valid("cash", "M-Pesa", "card"),

    status: Joi.string().valid("pending", "in-progress", "completed"),

    is_completed: Joi.boolean(),

    notes: Joi.string().allow("", null),
  }),
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const deleteOrder = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const findAndFilterOrders = {
  body: Joi.object().keys({
    sortBy: Joi.string().allow("", null).default(""),
    limit: Joi.number().default(10),
    page: Joi.number().default(0),
    search: Joi.string().allow("", null).default(""),
    match_values: Joi.object().allow(null).default(null),
  }),
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  findAndFilterOrders,
};
