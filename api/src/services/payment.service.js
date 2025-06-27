const { default: axios } = require("axios");
const { createError } = require("../configs/errorConfig.js");
const { Payment, User } = require("../models/index.js");
const { ObjectId } = require("mongodb");

const PAYSTACK_CODES = {
  SUCCESS: "charge.success",
  MOBILE: "mobile_money",
};

const createPayment = async (body) => {
  let user_id = "";
  let amount = 0;
  let payment_method = "mpesa";
  let payment_status = "pending";
  let status = "inactive";
  console.log("confirming mobile payments...");
  if (body.event === PAYSTACK_CODES.SUCCESS) {
    let { data } = body;
    user_id = data.metadata.user_id;
    amount = data.amount;
    status = "active";
    payment_status = "completed";
    if (data.charnel === PAYSTACK_CODES.MOBILE) {
      payment_method = "mpesa";
    }
  }
  const DAILY_COST = amount / 30; // KES per day (if plan is 1000 KES/month)
  const user = await User.findById(user_id);
  if (!user) throw createError(404, "User not found");

  const daysPaidFor = Math.floor(amount / DAILY_COST);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + daysPaidFor);

  const payment = new Payment({
    user_id: new ObjectId(user_id),
    amount,
    payment_method,
    payment_status: "completed",
    status: "active",
    expires_at: expiresAt,
  });

  const savedPayment = await payment.save();
  return savedPayment;
};

const findAndFilterPayments = async (filter, options) => {
  const payments = await Payment.paginate(filter, options);

  if (!payments) {
    throw createError(404, "No payments found.");
  }

  return payments;
};

const mobileMoneyPayment = async (data) => {
  let payload = {
    amount: data.amount,
    email: data.email,
    currency: "KES",
    mobile_money: {
      phone: data.phone_number.toString(),
      provider: "mpesa",
    },
    metadata: { user_id: data.user_id },
  };
  try {
    const resp = await axios.post(
      `${process.env.PAYSTACK_BASE_URL}/charge`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { data, ...others } = resp.data;
    return others;
  } catch (error) {
    throw createError(500, error);
  }
};

module.exports = {
  createPayment,
  findAndFilterPayments,
  mobileMoneyPayment,
};
