import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Package,
  TrendingUp,
  FileText,
  Users,
  CheckCircle,
  Clock,
  ShoppingBag,
  Smartphone,
  AlertCircle,
  Building,
} from "lucide-react";

import {
  USER_ROLES,
  type DateFilterType,
  type FilterState,
  type OrderStatus,
} from "../types";
import DateRangeFilter from "../components/DateRangeFilter";
import { useGetcompleteAnalysisQuery } from "../redux/apislice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { OfflineMode, PermissionValidation } from "../components";

const AnalysisPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterState>({
    dateFilter: "thisMonth",
  });
  const [branchFilter, setBranchFilter] = useState("all");
  const branches = useSelector((state: RootState) => state.branch.value);
  const user = useSelector((state: RootState) => state.user.value);
  const branchIds = useMemo(() => {
    if (branchFilter === "all") {
      return branches.map((br) => br._id).join(",");
    } else {
      return branchFilter
    }
  }, [branches, branchFilter]);

  const queryParams = useMemo(
    () =>
      `dateFilter=${filter.dateFilter}&branchId=${branchIds}&customStart=${filter.customStart}&customEnd=${filter.customEnd}`,
    [filter.dateFilter, filter.customStart, filter.customEnd, branchIds,],
  );
  const { data: completedData, isLoading } =
    useGetcompleteAnalysisQuery(queryParams);
  const analysisData = useMemo(
    () => completedData?.data || null,
    [completedData],
  );

  // Handle filter changes
  const handleDateFilterChange = (dateFilter: DateFilterType) => {
    setFilter((prev) => ({ ...prev, dateFilter }));
  };

  const handleCustomDateSubmit = (start: string, end: string) => {
    setFilter((prev) => ({
      ...prev,
      dateFilter: "custom",
      customStart: start,
      customEnd: end,
    }));
  };

  if (isLoading) {
    return (
      <OfflineMode>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading analysis data...</p>
          </div>
        </div>
      </OfflineMode>
    );
  }

  if (!analysisData) {
    return (
      <OfflineMode>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
            <p className="mt-4 text-gray-600">No analysis data available</p>
          </div>
        </div>
      </OfflineMode>
    );
  }

  const statusOptions: OrderStatus[] = [
    "pending",
    "processing",
    "washing",
    "drying",
    "ironing",
    "ready",
    "completed",
    "delivered",
    "cancelled",
  ];

  return (
    <OfflineMode>
      <div className="min-h-screen bg-gray-50 md:p-3">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 md:text-3xl">
                <FileText className="w-8 h-8 text-blue-600" />
                Analysis & Reports for{" "}
                {user.role === USER_ROLES.SUPER_ADMIN
                  ? branchFilter === "all"? "all branches":branches.find(item=>item._id === branchFilter)?.name
                  : "this branch"}
              </h1>
              <p className="mt-1 text-gray-600">
                Business performance analytics for your laundry
              </p>
            </div>

            <div className="flex items-center gap-3">
              <PermissionValidation>
                <div className="relative">
                  <select
                    value={ branchFilter }
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="all">All Branches</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <Building className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                </div>
              </PermissionValidation>
              {/* <button
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg shadow-sm hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button> */}
            </div>
          </div>
        </div>

        {/* Filters */}
        <DateRangeFilter
          currentFilter={filter.dateFilter}
          onFilterChange={handleDateFilterChange}
          onCustomDateSubmit={handleCustomDateSubmit}
        />

        {/* Main Performance Metrics */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            📊 Business Performance
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Revenue Card */}
            <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Total Revenue
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    KSh {analysisData.totalRevenue.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">From paid orders</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Total Orders
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {analysisData.totalOrders}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    All orders in period
                  </p>
                </div>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
            </div>

            {/* Expenses Card */}
            <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Total Expenses
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    KSh {analysisData.totalExpenses.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Operational costs
                  </p>
                </div>
                <span className="text-sm font-medium text-red-500">Costs</span>
              </div>
            </div>

            {/* Net Profit Card */}
            <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Net Profit
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${analysisData.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}
                  >
                    KSh {analysisData.netProfit.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Revenue - Expenses
                  </p>
                </div>
                <span
                  className={`text-sm font-medium ${analysisData.netProfit >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {analysisData.netProfit >= 0 ? "✅ Profit" : "⚠️ Loss"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            📈 Key Performance Indicators
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Order Value</p>
                  <p className="text-xl font-bold text-gray-800">
                    KSh{" "}
                    {analysisData.summary.averageOrderValue.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Per completed order
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-xl font-bold text-gray-800">
                    {analysisData.summary.completionRate}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Orders completed vs total
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Payments</p>
                  <p className="text-xl font-bold text-gray-800">
                    KSh {analysisData.summary.pendingPayments.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Awaiting payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Analysis */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            💰 Payment Analysis
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-5 bg-white border border-gray-200 shadow-md rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Paid Orders</p>
                    <p className="text-xl font-bold text-gray-800">
                      {analysisData.summary.paidOrders}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Payment received
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-green-600">
                    Paid
                  </span>
                  <p className="mt-1 text-xs text-gray-500">
                    {analysisData.summary.paidOrders > 0
                      ? Math.round(
                          (analysisData.summary.paidOrders /
                            analysisData.totalOrders) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-gray-200 shadow-md rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cash Payments</p>
                    <p className="text-xl font-bold text-gray-800">
                      {analysisData.summary.cashOrders}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Physical cash</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-600">Cash</span>
                  <p className="mt-1 text-xs text-gray-500">
                    {analysisData.summary.cashOrders > 0
                      ? Math.round(
                          (analysisData.summary.cashOrders /
                            analysisData.summary.paidOrders) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-gray-200 shadow-md rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Smartphone className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">M-Pesa Payments</p>
                    <p className="text-xl font-bold text-gray-800">
                      {analysisData.summary.mpesaOrders}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Mobile money</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium text-teal-600">M-Pesa</span>
                  <p className="mt-1 text-xs text-gray-500">
                    {analysisData.summary.mpesaOrders > 0
                      ? Math.round(
                          (analysisData.summary.mpesaOrders /
                            analysisData.summary.paidOrders) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            📦 Order Status Distribution
          </h2>
          <p className="mb-4 text-gray-600">
            Breakdown of orders by current processing stage
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {statusOptions.map((status) => (
              <div
                key={status}
                className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status)}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {analysisData.ordersByStatus[status] || 0}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {getStatusDescription(status)}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getStatusBarColor(status)}`}
                      style={{
                        width: `${(analysisData.ordersByStatus[status] / analysisData.totalOrders) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-right text-gray-500">
                    {analysisData.totalOrders > 0
                      ? Math.round(
                          (analysisData.ordersByStatus[status] /
                            analysisData.totalOrders) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="p-4 mt-8 border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h4 className="font-bold text-blue-800">📊 Financial Summary</h4>
              <p className="mt-1 text-sm text-blue-600">
                Showing data for{" "}
                <span className="font-semibold capitalize">
                  {filter.dateFilter}
                </span>
                {filter.dateFilter === "custom" &&
                filter.customStart &&
                filter.customEnd
                  ? ` (${filter.customStart} to ${filter.customEnd})`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="text-green-600">
                <span className="font-semibold">Revenue: </span>
                KSh {analysisData.totalRevenue.toLocaleString()}
              </div>
              <div className="text-red-600">
                <span className="font-semibold">Expenses: </span>
                KSh {analysisData.totalExpenses.toLocaleString()}
              </div>
              <div
                className={`font-bold ${analysisData.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}
              >
                <span className="font-semibold">Net Profit: </span>
                KSh {analysisData.netProfit.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
            <div className="p-3 bg-white bg-opacity-50 rounded-lg">
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-lg font-bold text-blue-700">
                {analysisData.totalRevenue > 0
                  ? (
                      (analysisData.netProfit / analysisData.totalRevenue) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-50 rounded-lg">
              <p className="text-sm text-gray-600">Expense Ratio</p>
              <p className="text-lg font-bold text-red-600">
                {analysisData.totalRevenue > 0
                  ? (
                      (analysisData.totalExpenses / analysisData.totalRevenue) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Daily Revenue</p>
              <p className="text-lg font-bold text-green-700">
                KSh{" "}
                {getDailyAverage(
                  analysisData.totalRevenue,
                  filter.dateFilter,
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </OfflineMode>
  );
};

// Helper functions
const getStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "washing":
    case "drying":
    case "ironing":
      return "bg-blue-100 text-blue-800";
    case "ready":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusBarColor = (status: string): string => {
  switch (status) {
    case "completed":
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    case "pending":
    case "processing":
      return "bg-yellow-500";
    case "washing":
    case "drying":
    case "ironing":
      return "bg-blue-500";
    case "ready":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusDescription = (status: string): string => {
  const descriptions: Record<string, string> = {
    pending: "Awaiting processing",
    processing: "Being processed",
    washing: "Currently washing",
    drying: "In dryer",
    ironing: "Being ironed",
    ready: "Ready for pickup/delivery",
    completed: "Order finished",
    delivered: "Delivered to customer",
    cancelled: "Order cancelled",
  };
  return descriptions[status] || status;
};

const getDailyAverage = (totalRevenue: number, period: string): number => {
  const daysMap: Record<string, number> = {
    today: 1,
    yesterday: 1,
    thisWeek: 7,
    thisMonth: 30,
    lastMonth: 30,
    custom: 7, // default for custom
  };

  const days = daysMap[period] || 7;
  return Math.round(totalRevenue / days);
};

export default AnalysisPage;
