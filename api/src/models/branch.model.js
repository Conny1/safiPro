const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginatePulugins");
const deletion = require("./plugins/deletion.plugin");

const brachSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business", // assuming you have a Branch model
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
  { timestamps: true }
);

// clientSchema.plugin(toJSON);
brachSchema.plugin(paginate);
brachSchema.plugin(deletion);

const Branch = mongoose.model("branch", brachSchema);
module.exports = Branch;
