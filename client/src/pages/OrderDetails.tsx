import React, { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
} from "../redux/apislice";
import {
  ForwardButtons,
  OfflineMode,
  OrderItems,
  PermissionValidation,
  UpdateOrder,
} from "../components";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Edit,
  FileText,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
  Tag,
  Trash2,
  Truck,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useOrderDB } from "../hooks/useOrderDB";
import useNetworkStatus from "../hooks/useNetworkStatus";
import type { Order } from "../types";

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    completed: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    "in-progress": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
    },
    delivered: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Truck,
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.pending;
  const Icon = statusConfig.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusConfig.color}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium capitalize">{status}</span>
    </div>
  );
};

const InfoCard = ({
  title,
  children,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}) => (
  <div className="p-5 transition-shadow bg-white border border-gray-200 rounded-xl hover:shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      )}
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-3 text-gray-700">{children}</div>
  </div>
);

const DetailItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | ReactNode;
  icon?: React.ElementType;
}) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-medium text-right text-gray-900">
      {value}
    </span>
  </div>
);

const OrderDetails = () => {
  const { isOnline } = useNetworkStatus();
  const { getOrder: getOrderWhileOffline, isReady } = useOrderDB();
  const [updateModal, setupdateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetOrderByIdQuery(id as string);
  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation();
  const navigate = useNavigate();
  const [order, setorder] = useState<Order>();
  useEffect(() => {
    if (!isOnline && id) {
      console.log("workking");
      getOrderWhileOffline(id).then((resp) => {
        const data = resp.data;
        if (resp.status === 200) {
          setorder(data as Order);
        }
      });
    } else {
      setorder(data?.data);
    }
  }, [isReady, isLoading, data?.data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 mb-4 text-gray-300" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Order Not Found
        </h2>
        <p className="mb-6 text-gray-600">
          The order you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/order")}
          className="flex items-center gap-2 px-4 py-2 font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
      </div>
    );
  }

  const handleDeleteOrder = async () => {
    try {
      const resp = await deleteOrder(id as string);
      if (resp.data?.status === 200) {
        toast.success("Order deleted successfully");
        setTimeout(() => {
          navigate("/order");
        }, 1500);
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-KE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString("en-KE") || "0"}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <button
                  onClick={() => navigate("/order")}
                  className="flex items-center gap-2 mb-4 text-gray-600 bg-transparent hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Orders
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Order #{order.order_no}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={order.status as string} />
                      <span className="text-sm text-gray-500">
                        Created{" "}
                        {formatDate(
                          order.createdAt ||
                            order.order_date ||
                            new Date().toISOString(),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Order Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Information */}
            <InfoCard title="Customer Information" icon={User}>
              <DetailItem
                label="Full Name"
                value={order.name || "N/A"}
                icon={User}
              />
              <DetailItem
                label="Phone Number"
                value={order.phone_number as string}
                icon={Phone}
              />
              {order?.email && (
                <DetailItem
                  label="Email Address"
                  value={order.email || "Not provided"}
                  icon={Mail}
                />
              )}{" "}
              {order?.address && (
                <DetailItem
                  label="Delivery Address"
                  value={order.address}
                  icon={MapPin}
                />
              )}
            </InfoCard>

            {/* Order Items */}
            <OfflineMode>
              <InfoCard title="Order Items" icon={Package}>
                {order.items_description && (
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-gray-700">{order.items_description}</p>
                  </div>
                )}
                <OrderItems
                  initialImages={order.items || []}
                  orderId={order._id as string}
                  orderName={order.name as string}
                />
              </InfoCard>
            </OfflineMode>

            {/* Service Details */}
            <InfoCard title="Service Details" icon={Home}>
              <DetailItem
                label="Service Type"
                value={order.service_type || "Standard"}
                icon={Tag}
              />
              <DetailItem
                label="Delivery Method"
                value={order.delivery_method || "Pickup"}
                icon={Truck}
              />
              {order.delivery_method === "pickup" && (
                <DetailItem
                  label="Pickup Date"
                  value={formatDate(order.pickup_date as string)}
                  icon={Calendar}
                />
              )}
              {order.delivery_method === "delivery" && (
                <DetailItem
                  label=" Delivery Date"
                  value={formatDate(order.pickup_date as string)}
                  icon={Calendar}
                />
              )}
            </InfoCard>

            {/* Additional Notes */}
            {order.notes && (
              <InfoCard title="Additional Notes" icon={FileText}>
                <div className="p-3 border border-yellow-100 rounded-lg bg-yellow-50">
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              </InfoCard>
            )}
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <InfoCard title="Order Summary" icon={FileText}>
              <div className="space-y-3">
                <DetailItem
                  label="Subtotal"
                  value={formatCurrency(order.amount || 0)}
                />
                {/* <DetailItem
                  label="Delivery Fee"
                  value={
                    order.delivery_fee
                      ? formatCurrency(order.delivery_fee)
                      : "KES 0"
                  }
                /> */}
                {/* <DetailItem
                  label="Discount"
                  value={
                    order.discount
                      ? `-${formatCurrency(order.discount)}`
                      : "KES 0"
                  }
                /> */}
                <div className="pt-3 border-t border-gray-200">
                  <DetailItem
                    label="Total Amount"
                    value={formatCurrency(order.amount || 0)}
                  />
                </div>
              </div>
            </InfoCard>

            {/* Payment Information */}
            <InfoCard title="Payment Information" icon={CreditCard}>
              <DetailItem
                label="Payment Status"
                value={
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.payment_status || "pending"} />
                  </div>
                }
              />
              <DetailItem
                label="Payment Method"
                value={order.payment_method || "Cash"}
              />
              {/* <DetailItem
                label="Amount Paid"
                value={formatCurrency(order.amount_paid || 0)}
              /> */}
              {/* {order.payment_date && (
                <DetailItem
                  label="Payment Date"
                  value={formatDate(order.payment_date as string)}
                />
              )} */}
            </InfoCard>

            {/* Actions */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setupdateModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Update Order
                </button>

                <ForwardButtons
                  message={`Hello ${
                    order.name || "there"
                  }, your laundry order #${order.order_no} is ${
                    order.status
                  }. ${
                    order.status === "completed"
                      ? "Ready for collection!"
                      : "Still in progress."
                  }`}
                  phone_number={order.phone_number as string}
                  // fullWidth
                />
                <PermissionValidation>
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Order
                    </button>
                  </div>
                </PermissionValidation>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">
                Order Timeline{" "}
                <span className="text-red-600"> feature comming soon</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-green-100 rounded-full mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order Created
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(
                        order.createdAt ||
                          order.order_date ||
                          new Date().toISOString(),
                      )}
                    </p>
                  </div>
                </div>

                {order.status !== "pending" && (
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                      <Clock className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Processing Started
                      </p>
                      <p className="text-xs text-gray-500">In progress</p>
                    </div>
                  </div>
                )}

                {order.status === "completed" && (
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-green-100 rounded-full mt-0.5">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order Completed
                      </p>
                      <p className="text-xs text-gray-500">
                        Ready for pickup/delivery
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Order Modal */}
      {updateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <UpdateOrder
              setupdateModal={setupdateModal}
              orderData={order}
              onUpdate={refetch}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 mx-4 bg-white shadow-2xl rounded-2xl">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Delete Order
              </h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete order #{order.order_no}? This
                action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrder}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
