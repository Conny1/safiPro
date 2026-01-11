import React, { useState } from "react";
import type {  Order } from "../types";
import { useUpdateOrderMutation } from "../redux/apislice";
import { toast, ToastContainer } from "react-toastify";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CreditCard,
  CheckCircle,
  FileText,
  Loader2,
  Tag,
  Clock,
  Save,
  RefreshCw,
  Plus,
  ShoppingBag,
} from "lucide-react";

type Props = {
  setupdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  orderData: Order;
  onUpdate?: () => void;
};

const UpdateOrder = ({ setupdateModal, orderData, onUpdate }: Props) => {
  const [formData, setFormData] = useState<Order>({
    name: orderData.name || "",
    email: orderData.email || "",
    phone_number: orderData.phone_number!,
    delivery_method: orderData.delivery_method || "pickup",
    items_description: orderData.items_description || "",
    service_type: orderData.service_type || "Wash Only",
    pickup_date: orderData.pickup_date?.split("T")[0] || "",
    amount: orderData.amount!,
    payment_status: orderData.payment_status || "pending",
    payment_method: orderData.payment_method || "cash",
    status: orderData.status || "pending",
    is_completed: orderData.is_completed || false,
    notes: orderData.notes || "",
    
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [updateOrder, { isLoading: updateloading }] = useUpdateOrderMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? parseFloat(value) || 0
        : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone_number) {
      toast.error("Phone number is required");
      return;
    }

    try {
      const result = await updateOrder({ 
        ...formData, 
        _id: orderData._id,
      });
      
      if (result.data?.status === 200) {
        toast.success("Order updated successfully!");
        setTimeout(() => {
          setupdateModal(false);
          onUpdate?.();
        }, 1500);
      } else {
        toast.error("Failed to update order. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const handleReset = () => {
    setFormData({
      name: orderData.name || "",
      email: orderData.email || "",
      phone_number: orderData.phone_number!,
      delivery_method: orderData.delivery_method || "pickup",
      items_description: orderData.items_description || "",
      service_type: orderData.service_type || "Wash Only",
      pickup_date: orderData.pickup_date?.split("T")[0] || "",
      amount: orderData.amount!,
      payment_status: orderData.payment_status || "pending",
      payment_method: orderData.payment_method || "cash",
      status: orderData.status || "pending",
      is_completed: orderData.is_completed || false,
      notes: orderData.notes || "",
    });
    toast.info("Form reset to original values");
  };


  const serviceTypes = [
    { value: "Wash Only", label: "Wash Only" },
    { value: "Dry Cleaning", label: "Dry Cleaning" },
    { value: "Ironing", label: "Ironing" },
    { value: "Wash & Fold", label: "Wash & Fold" },
    { value: "Full Service", label: "Full Service" },
    { value: "Wash & Iron", label: "Wash & Iron" },
  ];

  const deliveryMethods = [
    { value: "pickup", label: "Customer Pickup" },
    { value: "delivery", label: "Home Delivery" },
  ];

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "mpesa", label: "M-Pesa" },
  
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "washing", label: "Washing" },
    { value: "drying", label: "Drying" },
    { value: "ironing", label: "Ironing" },
    { value: "ready", label: "Ready for Pickup" },
    { value: "completed", label: "Completed" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partial Payment" },
    { value: "paid", label: "Paid" },
    { value: "refunded", label: "Refunded" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Update Order</h2>
            <p className="text-gray-600">
              Editing order #{orderData.order_no}
            </p>
          </div>
          <button
            onClick={() => setupdateModal(false)}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 px-6 pb-6 overflow-y-auto">
          {/* Order Info Summary */}
          <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Current Order Status</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-full">
                    {orderData.status || "pending"}
                  </span>
                  <span className="text-sm text-gray-600">
                    Created on {new Date(orderData.createdAt || orderData.order_date || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Changes
              </button>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
              <User className="w-5 h-5 text-gray-500" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0712 345 678"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
              <Package className="w-5 h-5 text-gray-500" />
              Order Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Pickup/Delivery Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    name="pickup_date"
                    type="date"
                    required
                    value={formData.pickup_date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Amount (KES) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="500.00"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Service Type
                </label>
                <div className="relative">
                  <Tag className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {serviceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Delivery Method
                </label>
                <div className="relative">
                  <Truck className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <select
                    name="delivery_method"
                    value={formData.delivery_method}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {deliveryMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Items Description *
                </label>
                <div className="relative">
                  <ShoppingBag className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                  <textarea
                    name="items_description"
                    required
                    value={formData.items_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Example: 3 Shirts, 2 Trousers, 1 Jacket..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Status */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
              <CreditCard className="w-5 h-5 text-gray-500" />
              Payment & Status
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="relative">
                  <CreditCard className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <div className="relative">
                  <CheckCircle className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Order Status
                </label>
                <div className="relative">
                  <Clock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="pt-6 mb-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Options
              <Plus className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-45' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        name="is_completed"
                        checked={formData.is_completed}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      Mark order as completed
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Automatically sets status to completed
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Special instructions, customer preferences, etc."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between gap-2 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setupdateModal(false)}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={updateloading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center gap-2"
              >
                {updateloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Order
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrder;