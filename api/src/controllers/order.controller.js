const { createError } = require("../configs/errorConfig");
const { pick } = require("../middlewares/validation");
const { orderService } = require("../services");
const ObjectId = require("mongoose").Types.ObjectId;

const addNewOrder = async (req, resp, next) => {
  try {
    const order = await orderService.addNewOrder({ business_id:req.user.business_id, ...req.body});
    resp
      .status(200)
      .json({ status: 200, data: { message: "New order added" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const updateOrder = async (req, resp, next) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    resp.status(200).json({ status: 200, order });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const deleteOrderItem = async (req, resp, next) => {
  try {
    const order = await orderService.deleteOrderItem(req.params.id, req.body);
    resp.status(200).json({ status: 200, order });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const getOrderByBranchid = async (req, resp, next) => {
  try {
    let filter = { is_deleted: false, business_id:req.user.business_id};

    for (key in req.body.match_values) {
      if (req.body.match_values[key] || req.body.match_values[key] === "") {
        filter[key] = req.body.match_values[key];
      }
      if (ObjectId.isValid(req.body.match_values[key]))
        filter[key] = new ObjectId(req.body.match_values[key]);
      else if (Array.isArray(req.body.match_values[key]))
        filter[key] = {
          $in: req.body.match_values[key].map((val) => {
            if (ObjectId.isValid(val)) {
              return new ObjectId(val);
            } else {
              return val;
            }
          }),
        };
    }
    const options = pick(req.body, ["sortBy", "limit", "page"]);
    if (req.body?.search) {
      filter["$or"] = [
        {
          name: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
        {
          email: { $regex: ".*" + req.body.search + ".*", $options: "i" },
        },
      ];
    }
    
    const order = await orderService.getOrderByBranchid(filter, options);

    resp.status(200).json({ status: 200, data: order });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const getOrderByid = async (req, resp, next) => {
  try {
    const order = await orderService.getOrderByid(req.params.id);
    resp.status(200).json({ status: 200, data: order });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const deleteOrder = async (req, resp, next) => {
  try {
    await orderService.deleteOrder(req.params.id);
    resp
      .status(200)
      .json({ status: 200, data: { message: "Order has been deleted" } });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

const dashboardanalysis = async (req, resp, next) => {
  try {
    const order = await orderService.dashboardanalysis(req.params.id);
    resp.status(200).json({ status: 200, data: order });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

module.exports = {
  addNewOrder,
  updateOrder,
  deleteOrder,
  getOrderByBranchid,
  getOrderByid,
  dashboardanalysis,
  deleteOrderItem
};
