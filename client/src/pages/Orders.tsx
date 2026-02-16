import { useEffect, useState } from "react";
import { AddOrder, PermissionValidation } from "../components";
import { Link } from "react-router";
import { USER_ROLES, type Order, type pagination } from "../types";
import { useFindAndFilterOrderMutation } from "../redux/apislice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  MoreVertical,
  Calendar,
  User,
  Phone,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  RefreshCw,
  FileText,
  ChevronDown,
  X,
} from "lucide-react";
import useNetworkStatus from "../hooks/useNetworkStatus";
import { useOrderDB } from "../hooks/useOrderDB";

const Orders = () => {
  // check connection
  const { isOnline } = useNetworkStatus();
  const { getOrders:getOfflineOrders, isReady } = useOrderDB();
  const user = useSelector((state: RootState) => state.user.value);
  const branches = useSelector((state: RootState) => state.branch.value);
  const [addModal, setaddModal] = useState(false);
  const [orders, setorders] = useState<Order[] | []>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });

  const [findAndFilterOrder, { isLoading: fetchloading }] =
    useFindAndFilterOrderMutation();

  const fetchOrders = () => {
    const filters: any = {
      match_values: {},
      sortBy: "_id:-1",
      limit: paginationdata.limit,
      page: paginationdata.page,
      search: searchTerm || "",
    };

    if (user.role !== USER_ROLES.SUPER_ADMIN) {
      filters.match_values.branch_id =  user.branches.map((val) => val?.branch_id)
      
    }

    if (statusFilter !== "all") {
      filters.match_values.status = statusFilter;
    }

    if (dateFilter !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (dateFilter) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      if (dateFilter !== "all") {
        filters.match_values.createdAt = { $gte: startDate.toISOString() };
      }
    }

    if (branchFilter !== "all" && user.branches.length > 1) {
      filters.match_values.branch_id = branchFilter;
    }
    // confirm connection B4 fetching The data.
    if (isOnline) {
      console.log("online mode");
      findAndFilterOrder(filters)
        .then((resp) => {
          if (resp.data?.status === 200) {
            setorders(resp.data.data.results);
            setpaginationdata({
              page: resp.data.data.page || 1,
              limit: resp.data.data.limit || 10,
              totalPages: resp.data.data.totalPages || 0,
              totalResults: resp.data.data.totalResults || 0,
            });
          } else {
            setorders([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("offline mode");
      // while offline fetch local data
      getOfflineOrders(filters)
        .then((resp) => {
          if (resp?.status === 200) {
            setorders(resp?.data.results as Order[]);
            setpaginationdata({
              page: resp.data.page || 1,
              limit: resp.data.limit || 10,
              totalPages: resp.data.totalPages || 0,
              totalResults: resp.data.totalResults || 0,
            });
          } else {
            setorders([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [
    paginationdata.page,
    paginationdata.limit,
    statusFilter,
    dateFilter,
    branchFilter,
    searchTerm,
    isReady,
  ]);

  const statusConfig = {
    completed: {
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      icon: CheckCircle,
    },
    pending: {
      color: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: Clock,
    },
    "in-progress": {
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: TrendingUp,
    },
    cancelled: {
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      icon: AlertCircle,
    },
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order._id as string));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString("en-KE") || "0"}`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setBranchFilter("all");
  };
  const statusOptions = [
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
    <div className="p-2 space-y-6 ">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track all laundry orders</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={() => setaddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-5 bg-white border border-gray-200 rounded-xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search orders by name, phone, or order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? (
                <ChevronDown className="w-4 h-4 rotate-180" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {(searchTerm ||
              statusFilter !== "all" ||
              dateFilter !== "all" ||
              branchFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Order List
              </h2>
              <p className="text-sm text-gray-600">
                {selectedOrders.length > 0
                  ? `${selectedOrders.length} order${selectedOrders.length > 1 ? "s" : ""} selected`
                  : `${paginationdata.totalResults} total orders`}
              </p>
            </div>
         
            <PermissionValidation>
                 {user.branches.length > 1 && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Branch
                </label>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            </PermissionValidation>
         
          </div>
        </div>

        {fetchloading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or create a new order
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedOrders.length === orders.length &&
                        orders.length > 0
                      }
                      onChange={handleSelectAll}
                      className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const status = getStatusConfig(order.status as string);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={order._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id as string)}
                          onChange={() =>
                            handleSelectOrder(order._id as string)
                          }
                          className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {order.order_no}
                            </span>
                          </div>
                          {/* {order.items && order.items.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </p>
                          )} */}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {order.name || "N/A"}
                            </span>
                          </div>
                          {order.phone_number && (
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {order.phone_number}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(order.amount || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.border} border`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span
                            className={`text-sm font-medium capitalize ${status.color}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(
                              order.createdAt || new Date().toISOString(),
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/orders/${order._id}`}>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </Link>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-gray-600">
              Showing {orders.length} of {paginationdata.totalResults} results
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setpaginationdata((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={paginationdata.page === 1 || fetchloading}
                className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:text-gray-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, paginationdata.totalPages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          setpaginationdata((prev) => ({
                            ...prev,
                            page: pageNum,
                          }))
                        }
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                          paginationdata.page === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}
                {paginationdata.totalPages > 5 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
              </div>

              <button
                onClick={() =>
                  setpaginationdata((prev) => ({
                    ...prev,
                    page: Math.min(paginationdata.totalPages, prev.page + 1),
                  }))
                }
                disabled={
                  paginationdata.page === paginationdata.totalPages ||
                  fetchloading
                }
                className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:text-gray-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <select
              value={paginationdata.limit}
              onChange={(e) =>
                setpaginationdata((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value),
                  page: 1,
                }))
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Order Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <AddOrder
              setaddModal={setaddModal}
              onSuccess={() => {
                fetchOrders();
              }}
            />
          </div>
        </div>
      )}

      {/* Bulk Actions (when orders are selected)
      {selectedOrders.length > 0 && (
        <div className="fixed flex items-center gap-4 px-6 py-3 text-white transform -translate-x-1/2 bg-gray-900 rounded-lg shadow-xl bottom-6 left-1/2">
          <span className="font-medium">{selectedOrders.length} orders selected</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded">
              Mark as Completed
            </button>
            <button className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded">
              Cancel Orders
            </button>
            <button className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-800 rounded">
              Export Selected
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="p-1.5 hover:bg-gray-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Orders;
