const { createError } = require("../configs/errorConfig.js");
const {  Expense } = require("../models/index.js");
const { ObjectId } = require("mongodb");

const addNewexpense = async (body) => {

  try {
    const expense = new Expense(body);
    const data = await expense.save();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const updateexpense = async (id, body) => {
  const expense = await Expense.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );

  return expense;
};

const getexpenseByid = async (id) => {
  const expense = await Expense.findById(id);
  if (!expense) {
    throw createError(404, "expense not found.");
  }
  return expense;
};

const findandfilter = async (filter, options) => {
  const expense = await Expense.paginate(filter, options);
  if (!expense) {
    throw createError(404, "expense not found.");
  }
  return expense;
};

const deleteexpense = async (id) => {
  const expense = await Expense.findByIdAndUpdate(new ObjectId(id), {
    $set: { is_deleted: true },
  });


  return expense;
};

module.exports = {
  addNewexpense,
  updateexpense,
  deleteexpense,
  getexpenseByid,
  findandfilter,
};
