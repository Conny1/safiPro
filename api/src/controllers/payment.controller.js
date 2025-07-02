const { Payment } = require("../models");
const { ObjectId } = require("mongodb");
const { createError } = require("../configs/errorConfig");
const { paymentService } = require("../services/index.js");
const { pick } = require("../middlewares/validation");

const createPayment = async (req, resp, next) => {
  console.log("1 was called");
  let body = req.body;
  try {
    resp
      .status(200)
      .json({ status: 200, data: { message: "New payment added" } });
    paymentService.createPayment(body);
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const findAndFilterPayments = async (req, res, next) => {
  try {
    let filter = {};

    for (const key in req.body.match_values) {
      const value = req.body.match_values[key];

      if (value || value === "") {
        if (ObjectId.isValid(value)) {
          filter[key] = new ObjectId(value);
        } else if (Array.isArray(value)) {
          filter[key] = { $in: value };
        } else {
          filter[key] = value;
        }
      }
    }

    if (req.body?.search) {
      filter["$or"] = [
        {
          payment_method: {
            $regex: ".*" + req.body.search + ".*",
            $options: "i",
          },
        },
        {
          payment_status: {
            $regex: ".*" + req.body.search + ".*",
            $options: "i",
          },
        },
      ];
    }

    const options = pick(req.body, ["sortBy", "limit", "page"]);

    const result = await paymentService.findAndFilterPayments(filter, options);

    res.status(200).json({ status: 200, data: result });
  } catch (error) {
    next(createError(error.status || 500, error.message));
  }
};

const mobileMoneyPayment = async (req, resp, next) => {
  try {
    const payment = await paymentService.mobileMoneyPayment(req.body);
    resp.status(200).json({ status: 200, data: payment });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};
module.exports = { findAndFilterPayments, createPayment, mobileMoneyPayment };
