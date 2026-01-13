const mongoose = require("mongoose");
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginatePulugins");
const deletion = require("./plugins/deletion.plugin");

const businessSchema = new mongoose.Schema(
  {
   
    name: {
      type: String,
      required: true,
    },
    description: {
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


businessSchema.plugin(paginate);
businessSchema.plugin(deletion);

const Business = mongoose.model("business", businessSchema);
module.exports = Business;
