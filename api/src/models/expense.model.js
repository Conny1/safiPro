const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginatePulugins");
const deletion = require("./plugins/deletion.plugin");

const expenseSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { Timestamp: true }
);

expenseSchema.plugin(paginate);
expenseSchema.plugin(deletion);

const Expense = mongoose.model("expense", expenseSchema);
module.exports = Expense;
