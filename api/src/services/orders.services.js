const { createError } = require("../configs/errorConfig.js");
const { Order, Branch } = require("../models/index.js");
const { ObjectId } = require("mongodb");

const generateOrderNo = async () => {
  try {
    const lastOrder = await Order.findOne({})
      .sort({ createdAt: -1 })
      .select("order_no")
      .lean();

    let newNumber = 1;

    if (lastOrder && lastOrder.order_no) {
      const parts = lastOrder.order_no.split("-");
      const lastNumber = parseInt(parts[1]);
      if (!isNaN(lastNumber)) {
        newNumber = lastNumber + 1;
      }
    }

    return `ORD-${newNumber}`;
  } catch (error) {
    console.error("Failed to generate order number:", error);
    throw new Error("Could not generate order number");
  }
};

const addNewOrder = async (body) => {
  const branch = await Branch.findOne({ _id: new ObjectId(body.branch_id) });
  if (!branch) {
    throw createError(404, "branch not found.");
  }
  try {
    const order_no = await generateOrderNo();
    body["order_no"] = order_no;
    const order = new Order(body);
    return await order.save();
  } catch (error) {
    throw new Error(error);
  }
};

const updateOrder = async (id, body) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );

  return order;
};

const getOrderByid = async (id) => {
  const order = await Order.findById(id);
  if (!order) {
    throw createError(404, "order not found.");
  }
  return order;
};

const getOrderByBranchid = async (filter, options) => {
  const order = await Order.paginate(filter, options);
  if (!order || order.length === 0) {
    throw createError(404, "Order not found.");
  }
  return order;
};

const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);

  return order;
};

module.exports = {
  addNewOrder,
  updateOrder,
  deleteOrder,
  getOrderByBranchid,
  getOrderByid,
};
