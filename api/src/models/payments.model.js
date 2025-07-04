const { Schema, model } = require("mongoose");
const paginate = require("./plugins/paginatePulugins");
const deletion = require("./plugins/deletion.plugin");

const paymentSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },

    amount: { type: Number, required: true }, // Total paid

    payment_method: {
      type: String,
      enum: ["card", "mpesa", "paypal", "free"],
      required: true,
    },

    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed", "free"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "inactive"],
      default: "active",
    },

    expires_at: { type: Date, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// clientSchema.plugin(toJSON);
paymentSchema.plugin(paginate);
paymentSchema.plugin(deletion);

const Payment = model("Payment", paymentSchema);
module.exports = Payment;
