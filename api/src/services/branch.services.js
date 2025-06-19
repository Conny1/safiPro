const { createError } = require("../configs/errorConfig.js");
const { User, Branch } = require("../models/index.js");
const { ObjectId } = require("mongodb");

const addNewBranch = async (body) => {
  const user = await User.findOne({ _id: new ObjectId(body.user_id) });
  if (!user) {
    throw createError(404, "user not found");
  }
  try {
    const branch = new Branch(body);
    return await branch.save();
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

const getBranchByUserid = async (filter, options) => {
  const branch = await Branch.paginate(filter, options);
  if (!branch || branch.length === 0) {
    throw createError(404, "Branch not found.");
  }
  return branch;
};

const deleteBranch = async (id) => {
  const branch = await branch.findByIdAndDelete(id);

  return branch;
};

module.exports = {
  addNewBranch,
  updateBranch,
  deleteBranch,
  getBranchByUserid,
  getBranchByid,
};
