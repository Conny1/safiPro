const mongoose = require("mongoose");
const paginate = require("./plugins/paginatePulugins");
const deletion = require("./plugins/deletion.plugin");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Business",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Super Admin", "Admin", "Branch Manager", "Staff"],
    },
    branches: [
      {
        branch_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Branch",
        },
        role: {
          type: String,
          enum: ["Admin", "Branch Manager", "Staff"],
        },
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", /// active for the one month free trial
    },
  },
  { timestamps: true },
);

userSchema.plugin(paginate);
userSchema.plugin(deletion);
const User = mongoose.model("user", userSchema);
module.exports = User;
