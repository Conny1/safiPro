const { default: mongoose } = require("mongoose");
const { createError } = require("../configs/errorConfig.js");
const { Order, Expense } = require("../models/index.js");

const getAnalysisData = async (
  branchId,
  dateFilter = "thisWeek",
  customStart,
  customEnd,
  business_id,
) => {
  // Build date match based on filter
  const dateMatch = buildDateMatch(dateFilter, customStart, customEnd);

  const data = await Order.aggregate([
    // Stage 1: Match orders by branch and date
    {
      $match: {
        branch_id: {
          $in: branchId.map((id) => new mongoose.Types.ObjectId(id)),
        },
        business_id: business_id,
        is_deleted: false,
        ...dateMatch,
      },
    },

    // Stage 2: Facet for multiple aggregations
    {
      $facet: {
        // Total orders count
        total_orders: [{ $count: "count" }],

        // Orders by status
        orders_by_status: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        // Completed orders (for revenue calculation)
        completed_orders: [
          {
            $match: {
              $or: [{ status: "completed" }, { status: "delivered" }],
            },
          },
          { $count: "count" },
        ],

        // Total revenue from paid orders
        total_revenue: [
          { $match: { payment_status: "paid" } },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ],

        // Pending payments (unpaid orders)
        pending_payments: [
          { $match: { payment_status: "pending" } },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ],

        // Payment methods breakdown
        payment_methods: [
          { $match: { payment_status: "paid" } },
          {
            $group: {
              _id: "$payment_method",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },

    // Stage 3: Project to format the data
    {
      $project: {
        // Basic counts
        total_orders: {
          $ifNull: [{ $arrayElemAt: ["$total_orders.count", 0] }, 0],
        },
        completed_orders: {
          $ifNull: [{ $arrayElemAt: ["$completed_orders.count", 0] }, 0],
        },

        // Orders by status object
        orders_by_status: {
          $arrayToObject: {
            $map: {
              input: "$orders_by_status",
              as: "statusGroup",
              in: {
                k: "$$statusGroup._id",
                v: "$$statusGroup.count",
              },
            },
          },
        },

        // Financial metrics
        total_revenue: {
          $ifNull: [{ $arrayElemAt: ["$total_revenue.total", 0] }, 0],
        },
        pending_payments: {
          $ifNull: [{ $arrayElemAt: ["$pending_payments.total", 0] }, 0],
        },

        // Payment method breakdown
        payment_methods: {
          $arrayToObject: {
            $map: {
              input: "$payment_methods",
              as: "method",
              in: {
                k: "$$method._id",
                v: "$$method.count",
              },
            },
          },
        },
      },
    },

    // Stage 4: Add calculated fields
    {
      $addFields: {
        // Calculate net profit (you'll need to fetch expenses separately)
        total_expenses: 0, // You'll need to fetch this from expenses collection

        // Calculate derived metrics
        net_profit: {
          $subtract: ["$total_revenue", 0], // Replace 0 with actual expenses
        },

        average_order_value: {
          $cond: [
            { $gt: ["$completed_orders", 0] },
            { $divide: ["$total_revenue", "$completed_orders"] },
            0,
          ],
        },

        completion_rate: {
          $cond: [
            { $gt: ["$total_orders", 0] },
            {
              $multiply: [
                { $divide: ["$completed_orders", "$total_orders"] },
                100,
              ],
            },
            0,
          ],
        },

        // Payment method counts
        cash_orders: {
          $ifNull: ["$payment_methods.cash", 0],
        },
        mpesa_orders: {
          $ifNull: ["$payment_methods.mpesa", 0],
        },
        paid_orders: {
          $add: [
            { $ifNull: ["$payment_methods.cash", 0] },
            { $ifNull: ["$payment_methods.mpesa", 0] },
          ],
        },
      },
    },

    // Stage 5: Final projection to match dummyData structure
    {
      $project: {
        totalRevenue: "$total_revenue",
        totalOrders: "$total_orders",
        totalExpenses: "$total_expenses", // You'll need to populate this
        netProfit: "$net_profit",
        ordersByStatus: {
          pending: { $ifNull: ["$orders_by_status.pending", 0] },
          processing: { $ifNull: ["$orders_by_status.processing", 0] },
          washing: { $ifNull: ["$orders_by_status.washing", 0] },
          drying: { $ifNull: ["$orders_by_status.drying", 0] },
          ironing: { $ifNull: ["$orders_by_status.ironing", 0] },
          ready: { $ifNull: ["$orders_by_status.ready", 0] },
          completed: { $ifNull: ["$orders_by_status.completed", 0] },
          delivered: { $ifNull: ["$orders_by_status.delivered", 0] },
          cancelled: { $ifNull: ["$orders_by_status.cancelled", 0] },
        },
        summary: {
          averageOrderValue: { $round: ["$average_order_value", 2] },
          completionRate: { $round: ["$completion_rate", 2] },
          pendingPayments: "$pending_payments",
          topServiceType: "Wash & Iron", // You can calculate this if needed
          paidOrders: "$paid_orders",
          cashOrders: "$cash_orders",
          mpesaOrders: "$mpesa_orders",
        },
      },
    },
  ]);

  if (!data || !data.length) {
    // Return default structure if no data
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalExpenses: 0,
      netProfit: 0,
      ordersByStatus: {
        pending: 0,
        processing: 0,
        washing: 0,
        drying: 0,
        ironing: 0,
        ready: 0,
        completed: 0,
        delivered: 0,
        cancelled: 0,
      },
      summary: {
        averageOrderValue: 0,
        completionRate: 0,
        pendingPayments: 0,
        topServiceType: "Wash & Iron",
        paidOrders: 0,
        cashOrders: 0,
        mpesaOrders: 0,
      },
    };
  }

  return data[0];
};

// Helper function to build date match based on filter
const buildDateMatch = (dateFilter, customStart, customEnd) => {
  const now = new Date();
  let startDate, endDate;

  switch (dateFilter) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;

    case "yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = new Date(yesterday.setHours(0, 0, 0, 0));
      endDate = new Date(yesterday.setHours(23, 59, 59, 999));
      break;

    case "thisWeek":
      const startOfWeek = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(startOfWeek.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;

    case "thisMonth":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;

    case "lastMonth":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "custom":
      if (customStart && customEnd) {
        startDate = new Date(customStart);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
      }
      break;

    default:
      // Default to this week
      const defaultStartOfWeek = new Date(now);
      const defaultDay = now.getDay();
      const defaultDiff =
        now.getDate() - defaultDay + (defaultDay === 0 ? -6 : 1);
      startDate = new Date(defaultStartOfWeek.setDate(defaultDiff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
  }

  if (startDate && endDate) {
    return {
      order_date: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }

  return {};
};

// If you need to fetch expenses too, add this function:
const getExpensesData = async (branchId, dateMatch, business_id) => {
  // Assuming you have an Expense model
  const expenses = await Expense.aggregate([
    {
      $addFields: {
        dateAsDate: {
          $dateFromString: {
            dateString: "$date",
          },
        },
      },
    },
    {
      $match: {
        branch_id: {
          $in: branchId.map((id) => new mongoose.Types.ObjectId(id)),
        },
        business_id: business_id,
        is_deleted: false,
        dateAsDate: {
          $gte: new Date(dateMatch.order_date.$gte),
          $lte: new Date(dateMatch.order_date.$lte),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        total_expenses: "$total",
      },
    },
  ]);

  return expenses[0] || { total_expenses: 0 };
};

// Main function to combine orders and expenses
const getCompleteAnalysisData = async (
  branchId,
  dateFilter = "thisWeek",
  customStart,
  customEnd,
  business_id,
) => {
  const dateMatch = buildDateMatch(dateFilter, customStart, customEnd);

  const [ordersData, expensesData] = await Promise.all([
    getAnalysisData(branchId, dateFilter, customStart, customEnd, business_id),
    getExpensesData(branchId, dateMatch, business_id),
  ]);

  // Combine the data
  return {
    ...ordersData,
    totalExpenses: expensesData.total_expenses,
    netProfit: ordersData.totalRevenue - expensesData.total_expenses,
  };
};

module.exports = {
  getCompleteAnalysisData,
};
