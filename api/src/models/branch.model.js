const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginatePulugins");
const deletion = require("./plugins/deletion.plugin");

const brachSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you have a Branch model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
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

// clientSchema.plugin(toJSON);
brachSchema.plugin(paginate);
brachSchema.plugin(deletion);

const Branch = mongoose.model("brach", brachSchema);
module.exports = Branch;
