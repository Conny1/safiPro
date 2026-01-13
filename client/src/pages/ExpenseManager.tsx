import React, { useState, useEffect } from "react";

import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Calendar,
  Package,
  Wrench,
  Home,
  FileText,
  Users,
  ChevronDown,
  LoaderIcon,
} from "lucide-react";
import type {
  Expense,
  ExpenseCategory,
  CategoryInfo,
  PaymentMethod,
  PaymentMethodInfo,
  DateFilter,
  pagination,
  addExpenseType,
} from "../types";
import { ExpenseForm } from "../components";
import {
  useAddnewExpenseMutation,
  useDeleteExpenseMutation,
  useFindAndFilterExpenseMutation,
  useUpdateExpenseMutation,
} from "../redux/apislice";
import { toast, ToastContainer } from "react-toastify";

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    from: "",
    to: "",
  });
  const [addExpense, {isLoading:addLoading }] = useAddnewExpenseMutation();
  const [updateExpense ,{isLoading:updateLoading} ] = useUpdateExpenseMutation();
  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  const [findAndFilterExpense] =
    useFindAndFilterExpenseMutation();
const [deleteExpense, {isLoading:deleteLoading}] = useDeleteExpenseMutation()
  const fetchExpense = () => {
    const filters: any = {
      match_values: {},
      sortBy: "_id:-1",
      limit: paginationdata.limit,
      page: paginationdata.page,
      search: searchTerm || "",
    };

    if (selectedCategory !== "all") {
      filters.match_values.category = selectedCategory;
    }

    // if (dateFilter.from) {
    //   let startDate = dateFilter.from
    //   filters.match_values.date = { $gte: startDate };
    // }

    // if (dateFilter.to) {
    //   let startDate = dateFilter.to;
    //   filters.match_values.createdAt = { $lte: startDate };
    // }

    findAndFilterExpense(filters)
      .then((resp) => {
        if (resp.data?.status === 200) {
          console.log(resp.data)
          setExpenses(resp.data.data.results);
          setpaginationdata({
            page: resp.data.data.page || 1,
            limit: resp.data.data.limit || 10,
            totalPages: resp.data.data.totalPages || 0,
            totalResults: resp.data.data.totalResults || 0,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(expenses)
    fetchExpense();
  }, [paginationdata.page, selectedCategory, dateFilter, searchTerm]);

  // Expense categoriesbank
  const categories: CategoryInfo[] = [
    {
      id: "supplies",
      label: "Supplies",
      icon: <Package className="w-4 h-4" />,
      color: "bg-green-500",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: <Wrench className="w-4 h-4" />,
      color: "bg-orange-500",
    },
    {
      id: "rent",
      label: "Rent",
      icon: <Home className="w-4 h-4" />,
      color: "bg-purple-500",
    },
    {
      id: "utilities",
      label: "Utilities",
      icon: <FileText className="w-4 h-4" />,
      color: "bg-blue-500",
    },
    {
      id: "salaries",
      label: "Salaries",
      icon: <Users className="w-4 h-4" />,
      color: "bg-red-500",
    },
    {
      id: "other",
      label: "Other",
      icon: <FileText className="w-4 h-4" />,
      color: "bg-gray-500",
    },
  ];

  const paymentMethods: Record<PaymentMethod, PaymentMethodInfo> = {
    cash: { label: "Cash", color: "border-green-500 text-green-600" },
    mpesa: { label: "M-Pesa", color: "border-blue-500 text-blue-600" },
    bank: {
      label: "Bank Transfer",
      color: "border-purple-500 text-purple-600",
    },
    card: { label: "Card", color: "border-yellow-500 text-yellow-600" },
  };

  // // Calculate totals
  // const totalExpenses = expenses.reduce(
  //   (sum: number, expense: Expense) => sum + expense.amount,
  //   0
  // );
  // const monthlyTotal = expenses
  //   .filter((e) => e.date?.startsWith("2024-01"))
  //   .reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

  const handleAddExpense = (): void => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense: Expense): void => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = async (id: string) => {
    const resp = await deleteExpense(id);
    if (resp.data?.status == 200) {
      fetchExpense()
      toast.success("expense deleted");
    } else {
      toast.error("Try again..");
    }
  };
  const addnewExpense = async (data: addExpenseType) => {
    const resp = await addExpense(data);
    if (resp.data?.status == 200) {
      fetchExpense()
      setShowForm(false);
      toast.success("new expense added");
      
    } else {
      toast.error("Try again..");
    }
  };

  const updateTheExpense = async (data: Partial<Expense>) => {
    const resp = await updateExpense(data);
    if (resp.data?.status == 200) {
      fetchExpense()
      setShowForm(false);
      toast.success("Data edited");
    } else {
      toast.error("Try again..");
    }
  };
  const handleSaveExpense = (expenseData: Omit<Expense, "_id">): void => {
    if (editingExpense) {
      updateTheExpense({...expenseData,_id:editingExpense._id });
    } else {
      addnewExpense(expenseData);
    }
  };

  const formatCurrency = (amount: number): string => { 
    return `Ksh ${amount.toLocaleString("en-KE")}`;
  };

  const getCategoryInfo = (categoryId: ExpenseCategory): CategoryInfo => {
    return (
      categories.find((cat) => cat.id === categoryId) ||
      categories.find((cat) => cat.id === "other")!
    );
  };

  // const handleDateFilterChange = (
  //   field: keyof DateFilter,
  //   value: string
  // ): void => {
  //   setDateFilter((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  return (
    <div className="p-4 mx-auto ">
      {/* Header */}
      <ToastContainer/>
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Expense Management
          </h1>
          <p className="mt-1 text-gray-600">
            Track and manage your business expenses
          </p>
        </div>
        <button
          onClick={handleAddExpense}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Summary Cards
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white border rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(monthlyTotal)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800">
                {expenses.length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Per Expense</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  expenses.length > 0 ? totalExpenses / expenses.length : 0
                )}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Search and Filter Bar */}
      <div className="p-4 mb-6 bg-white border rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex gap-2 md:col-span-4">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setDateFilter({ from: "", to: "" });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedCategory(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
{/* 
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleDateFilterChange("from", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}

              {/* <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleDateFilterChange("to", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? `${category.color} text-white`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="overflow-hidden bg-white border rounded-lg shadow">
        {expenses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-2 text-gray-400">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600">
              No expenses found.{" "}
              {searchTerm
                ? "Try a different search."
                : "Add your first expense!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {expenses.map((expense: Expense) => {
              const categoryInfo = getCategoryInfo(expense.category);
              const paymentInfo = paymentMethods[expense.paymentMethod];

              return (
                <div
                  key={expense._id}
                  className="p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-start flex-1 gap-3">
                      <div className={`${categoryInfo.color} p-2 rounded-lg`}>
                        {categoryInfo.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center">
                          <h3 className="font-medium text-gray-900">
                            {expense.description}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${categoryInfo.color.replace(
                                "bg-",
                                "bg-"
                              )} bg-opacity-20 text-gray-700`}
                            >
                              {categoryInfo.label}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium border ${paymentInfo.color}`}
                            >
                              {paymentInfo.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {expense.date}
                          </span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(expense.amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                      disabled={deleteLoading}
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                       { deleteLoading? <LoaderIcon className="w-4 h-4" />  : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ExpenseForm
                expense={editingExpense}
                onSave={handleSaveExpense}
                onCancel={() => setShowForm(false)}
                categories={categories}
                isLoading={ addLoading || updateLoading }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
