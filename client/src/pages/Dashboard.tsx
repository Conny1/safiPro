import { useEffect, useState } from "react";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  PlusCircle,
  Settings,
  List,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Building,
  RefreshCw,
} from "lucide-react";
import AddBranchModal from "../components/NewBranch";
import { Link } from "react-router";
import { Listbranches } from "../components";
import { ToastContainer } from "react-toastify";
import {
  useFindAndFilterOrderMutation,
  useGetBranchNamesByuserIdQuery,
  useGetOrderDashbardAnalysisQuery,
} from "../redux/apislice";
import { USER_ROLES, type Branch, type Order } from "../types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import useNetworkStatus from "../hooks/useNetworkStatus";
import { useOrderDB } from "../hooks/useOrderDB";
import { updatebranchData } from "../redux/branchSlice";

const Dashboard = () => {
  // check connection
  const { isOnline } = useNetworkStatus();
  const { getOrders: getOfflineOrders, isReady } = useOrderDB();
  const user = useSelector((state: RootState) => state.user.value);
  const offlineBranchData = useSelector(
    (state: RootState) => state.branch.value
  );
  const dispatch = useDispatch();
  const [branchModal, setbranchModal] = useState(false);
  const [activeBranch, setactiveBranch] = useState(
    user.role === USER_ROLES.SUPER_ADMIN ? "" : user?.branches[0]?.branch_id
  );
  const [lisbranchesModal, setlisbranchesModal] = useState(false);
  const [recentOrders, setrecentOrders] = useState<Order[] | []>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const [findAndFilterOrder, { isLoading: findloading }] =
    useFindAndFilterOrderMutation();

  const { data: allBranchesResp, refetch: refetchBranches } =
    useGetBranchNamesByuserIdQuery(user._id);
  const [allBranches, setallBranches] = useState<Branch[] | []>(
    offlineBranchData
  );
  const { data: dashboard_analysis, refetch: refetchDashboard } =
    useGetOrderDashbardAnalysisQuery(activeBranch);

  // Status colors mapping
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

  const stats = [
    {
      title: "Total Orders",
      value: dashboard_analysis?.data.total_orders || 0,
      trend: "up",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Completed",
      value: dashboard_analysis?.data.completed_orders || 0,
      trend: "up",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending",
      value: dashboard_analysis?.data.pending_orders || 0,
      trend: "down",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Total Revenue",
      value: `KES ${
        dashboard_analysis?.data.total_revenue?.toLocaleString() || "0"
      }`,
      trend: "up",
      icon: DollarSign,
      color: "purple",
    },
  ];

  const quickActions = [
    {
      title: "New Order",
      description: "Create a new laundry order",
      icon: PlusCircle,
      color: "blue",
      link: "/order",
    },
    {
      title: "New Branch",
      description: "Add a new branch location",
      icon: Building,
      color: "green",
      onClick: () => setbranchModal(true),
      show: user.role === USER_ROLES.SUPER_ADMIN,
    },
    {
      title: "View Branches",
      description: "Manage all branches",
      icon: List,
      color: "purple",
      onClick: () => setlisbranchesModal(true),
      show: user.role === USER_ROLES.SUPER_ADMIN,
    },
    {
      title: "Settings",
      description: "Configure your account",
      icon: Settings,
      color: "gray",
      link: "/settings",
    },
  ];

  useEffect(() => {
    if (allBranchesResp && "data" in allBranchesResp) {
      if (allBranchesResp.data.length > 0) {
        setallBranches(allBranchesResp.data);
        dispatch(updatebranchData(allBranchesResp.data));
      }

      if (
        !activeBranch &&
        (allBranchesResp.data.length > 0 || offlineBranchData.length > 0)
      ) {
        let id =
          (allBranchesResp.data[0]._id as string) || offlineBranchData[0]._id;
        setactiveBranch(id);
      }
    }
  }, [allBranchesResp]);

  useEffect(() => {
    if (!activeBranch) return;

    const filters: any = {
      match_values: {
        branch_id: activeBranch,
      },
      sortBy: "_id:-1",
      limit: 10,
      page: 1,
    };

    if (statusFilter !== "all") {
      filters.match_values.status = statusFilter;
    }
    if (isOnline) {
      findAndFilterOrder(filters)
        .then((resp) => {
          if (resp.data?.status === 200) {
            const orders = resp.data.data.results;

            setrecentOrders(orders);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("offline mode");
      // while offline fetch local data
      getOfflineOrders(filters)
        .then((resp) => {
          if (resp?.status === 200) {
            setrecentOrders(resp?.data.results as Order[]);
          } else {
            setrecentOrders([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activeBranch, statusFilter, isReady]);

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
    gray: {
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-200",
    },
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

  const handleRefresh = () => {
    refetchDashboard();
    refetchBranches();
  };

  return (
    <div className="min-h-screen p-2 space-y-8 bg-gray-50">
      <ToastContainer />

      {/* Modals */}
      {branchModal && <AddBranchModal setbranchModal={setbranchModal} />}
      {lisbranchesModal && (
        <Listbranches setlisbranchesModal={setlisbranchesModal} />
      )}

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user.first_name || "User"}! Here's what's happening
            today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          {user.role === USER_ROLES.SUPER_ADMIN && (
            <div className="relative">
              <select
                value={activeBranch}
                onChange={(e) => setactiveBranch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Select Branch</option>
                {allBranches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <Building className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colors = colorClasses[stat.color as keyof typeof colorClasses];

          return (
            <div
              key={i}
              className={`${colors.bg} ${colors.border} border rounded-xl p-5 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Orders
              </h2>
              <p className="text-gray-600">
                Latest laundry orders and their status
              </p>
            </div>

            <div className="flex flex-col w-full gap-3 sm:flex-row lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>

                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}{" "}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {findloading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : recentOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Order No.
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
                {recentOrders.map((item) => {
                  const status =
                    statusConfig[item.status as keyof typeof statusConfig] ||
                    statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {item.order_no}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.phone_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          KES {item.amount?.toLocaleString() || "0"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.border} border`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span
                            className={`text-sm font-medium capitalize ${status.color}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          {new Date(
                            item.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/orders/${item._id}`}>
                          <button className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700">
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No orders found</p>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or create a new order
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {recentOrders.length} most recent orders
          </p>
          <Link to="/order">
            <button className="font-medium text-blue-600 hover:text-blue-700">
              View All Orders
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Actions & Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions
                .filter((action) => action.show !== false)
                .map((action, i) => {
                  const Icon = action.icon;
                  const colors =
                    colorClasses[action.color as keyof typeof colorClasses];

                  return action.link ? (
                    <Link key={i} to={action.link}>
                      <div
                        className={`flex items-center gap-4 p-4 ${colors.border} border rounded-lg hover:shadow-md transition-all cursor-pointer group`}
                      >
                        <div className={`p-3 rounded-lg ${colors.bg}`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {action.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={i}
                      onClick={action.onClick}
                      className={`flex items-center gap-4 p-4 ${colors.border} border rounded-lg hover:shadow-md transition-all cursor-pointer group`}
                    >
                      <div className={`p-3 rounded-lg ${colors.bg}`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Performance Overview
                </h2>
                <p className="text-gray-600">Orders and revenue trends</p>
              </div>
              <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>

            {/* Chart Placeholder */}
            <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Revenue chart coming soon</p>
                <p className="text-sm text-gray-500">
                  Visualize your business growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Summary (for Super Admin) */}
      {user.role === USER_ROLES.SUPER_ADMIN && allBranches.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Branch Performance
              </h2>
              <p className="text-gray-600">Overview across all branches</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allBranches.slice(0, 3).map((branch) => (
              <div
                key={branch._id}
                className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{branch.name}</h3>
                </div>
                <div className="space-y-2">
                  {/* <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Today's Orders</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-medium">KES 15,000</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {allBranches.length > 3 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setbranchModal(true)}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                View All {allBranches.length} Branches
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
