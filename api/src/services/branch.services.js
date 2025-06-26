const { createError } = require("../configs/errorConfig.js");
const { User, Branch, Order } = require("../models/index.js");
const { ObjectId } = require("mongodb");

const addNewBranch = async (body) => {
  const user = await User.findOne({ _id: new ObjectId(body.user_id) });
  if (!user) {
    throw createError(404, "user not found");
  }
  try {
    const branch = new Branch(body);
    const data = await branch.save();
    await User.findByIdAndUpdate(new ObjectId(user._id), {
      $push: { branches: { role: user.role, branch_id: data._id } },
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const updateBranch = async (id, body) => {
  const branch = await Branch.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );

  return branch;
};

const getBranchByid = async (id) => {
  const branch = await Branch.findById(id);
  if (!branch) {
    throw createError(404, "branch not found.");
  }
  return branch;
};

const findandfilter = async (filter, options) => {
  const branch = await Branch.paginate(filter, options);
  if (!branch || branch.length === 0) {
    throw createError(404, "Branch not found.");
  }
  return branch;
};
const getBranchByUserid = async (user_id) => {
  const branch = await Branch.find({ user_id, is_deleted: false });
  if (!branch || branch.length === 0) {
    throw createError(404, "Branch not found.");
  }
  return branch;
};

const deleteBranch = async (id) => {
  const branch = await Branch.findByIdAndUpdate(new ObjectId(id), {
    $set: { is_deleted: true },
  });
  // await Order.updateMany({ branch_id: new ObjectId(id) }, { is_deleted: true });

  return branch;
};

module.exports = {
  addNewBranch,
  updateBranch,
  deleteBranch,
  getBranchByUserid,
  getBranchByid,
  findandfilter,
};
