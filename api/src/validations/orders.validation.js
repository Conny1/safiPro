const Joi = require("joi");
const { objectId } = require("../utils/index");
  const paymentStatusOptions = [ "pending",  "partial",  "paid", "refunded"]
  const statusOptions = ["pending", "processing","washing","drying","ironing","ready", "completed", "delivered","cancelled"]
const createOrder = {
  body: Joi.object().keys({
    order_no: Joi.string().required(),
    branch_id: Joi.string().custom(objectId).required(),
    name: Joi.string().required(),
    email: Joi.string().email().allow("", null),
    phone_number: Joi.string().required(),
    delivery_method: Joi.string()
      .valid( "pickup" , "delivery")
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
    address: Joi.string().allow(null,""),
    pickup_date: Joi.string().required(),
    order_date: Joi.string().optional(),
    amount: Joi.number().required(),
    currency: Joi.string().default("KES"),
    payment_status: Joi.string().valid(...paymentStatusOptions).required(),
    payment_method: Joi.string().valid("cash", "mpesa", "card").required(),

    status: Joi.string()
      .valid(...statusOptions)
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
    email: Joi.string().email().allow("", null),
    phone_number: Joi.string(),
    is_deleted: Joi.boolean(),
    delivery_method: Joi.string().valid( "pickup" , "delivery"),
    items_description: Joi.string().allow("", null),
    address: Joi.string().allow(null,""),
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
    payment_status: Joi.string().valid(...paymentStatusOptions),
    payment_method: Joi.string().valid("cash", "mpesa", "card"),

    status: Joi.string().valid(...statusOptions),

    is_completed: Joi.boolean(),
    _id: Joi.custom(objectId).required(),
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





