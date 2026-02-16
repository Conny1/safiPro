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
  if (!branch) {
    throw createError(404, "Branch not found.");
  }
  return branch;
};
const getBranchByBusiness_id = async (business_id) => {
  const branch = await Branch.find({ business_id, is_deleted: false });
  if (!branch || branch.length === 0) {
    throw createError(404, "Branch not found.");
  }
  return branch;
};

const deleteBranch = async (id) => {
  const branch = await Branch.findByIdAndUpdate(new ObjectId(id), {
    $set: { is_deleted: true },
  });

  await User.updateMany(
{    business_id:new ObjectId(branch.business_id), },    {
      $pull: {
        branches: { branch_id: new ObjectId(id) }, // Match the branch_id to remove
      },
    }
  );

  return branch;
};

module.exports = {
  addNewBranch,
  updateBranch,
  deleteBranch,
  getBranchByBusiness_id,
  getBranchByid,
  findandfilter,
};
