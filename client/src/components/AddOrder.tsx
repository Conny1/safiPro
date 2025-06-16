import React, { useState } from "react";
import type { addOrder } from "../types";

type Props = {
  setaddModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddOrder = ({ setaddModal }: Props) => {
  const [formData, setFormData] = useState<addOrder>({
    name: "",
    email: "",
    phone_number: "",
    delivery_method: "Pickup",
    items_description: "",
    service_type: "Wash Only",
    pickup_date: "",
    amount: 0,
    payment_status: "pending",
    payment_method: "cash",
    status: "pending",
    is_completed: false,
    notes: "",
  });

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
        ? parseFloat(value)
        : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone_number) {
      alert("Phone number is required.");
      return;
    }

    console.log("Submitted Order:", formData);
    // Reset
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      delivery_method: "Pickup",
      items_description: "",
      service_type: "Wash Only",
      pickup_date: "",
      amount: 0,
      payment_status: "pending",
      payment_method: "cash",
      status: "pending",
      is_completed: false,
      notes: "",
    });
    setaddModal(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-[70vh] max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6 overflow-y-scroll "
    >
      <h2 className="text-2xl font-semibold text-gray-800">Add New Order</h2>

      {/* Customer Info */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Customer Info
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="email@example.com"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number * (required)
            </label>
            <input
              name="phone_number"
              required
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="07XXXXXXXX"
            />
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Order Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Date * (required)
            </label>
            <input
              name="pickup_date"
              type="date"
              required
              value={formData.pickup_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (KES) * (required)
            </label>
            <input
              name="amount"
              type="number"
              required
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="e.g. 500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option>Wash Only</option>
              <option>Dry Cleaning</option>
              <option>Ironing</option>
              <option>Wash & Fold</option>
              <option>Full Service</option>
              <option>Wash & Iron</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Method * (required)
            </label>
            <select
              name="delivery_method"
              value={formData.delivery_method}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="Pickup">Pickup</option>
              <option value="Customer drop-off">Customer Drop-off</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Items Description
            </label>
            <textarea
              name="items_description"
              value={formData.items_description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="e.g. 3 Shirts, 2 Trousers..."
            />
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Payment & Status
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="cash">Cash</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="is_completed"
              checked={formData.is_completed}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Mark as Completed
            </label>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Any additional notes..."
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setaddModal(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Submit Order
        </button>
      </div>
    </form>
  );
};

export default AddOrder;
