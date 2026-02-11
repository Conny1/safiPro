const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginatePulugins");
const deletion = require("./plugins/deletion.plugin");
const { string } = require("joi");

const OrderSchema = new mongoose.Schema(
  {
    order_no: {
      type: String,
      required: true,
      unique: true,
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business", // assuming you have a Branch model
      required: true,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", // assuming you have a Branch model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: ["cash", "mpesa", "card"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "washing",
        "drying",
        "ironing",
        "ready",
        "completed",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    order_date: {
      type: Date,
      required: true,
    },
    pickup_date: {
      type: Date,
      required: true,
    },
    service_type: {
      type: String,
      enum: [
        "Wash Only",
        "Dry Cleaning",
        "Ironing",
        "Wash & Fold",
        "Full Service",
        "Wash & Iron",
      ],
      required: true,
    },
    items_description: {
      type: String,
      default: "",
    },
    items: {
      type: [
        {
          description: String,
          url: String,
          id: String,
        },
      ],
      default: [],
    },
    delivery_method: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// clientSchema.plugin(toJSON);
OrderSchema.plugin(paginate);
OrderSchema.plugin(deletion);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
