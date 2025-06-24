import React, { useEffect, useState } from "react";
import { USER_ROLES, type addOrder, type Branch } from "../types";
import {
  useCreateNewOrderMutation,
  useGetBranchNamesByuserIdQuery,
} from "../redux/apislice";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

type Props = {
  setaddModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddOrder = ({ setaddModal }: Props) => {
  const user = useSelector((state: RootState) => state.user.value);
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
  // SET STATE BASED ON USER ROLES
  const [activeBranch, setactiveBranch] = useState(
    user.role === USER_ROLES.SUPER_ADMIN ? "" : user.branches[0].branch_id
  );
  // FETCH BASED ON USER ROLES
  const { data: allBranchesResp } = useGetBranchNamesByuserIdQuery(user._id, {
    skip: user.role !== USER_ROLES.SUPER_ADMIN,
  });
  const [allBranches, setallBranches] = useState<Branch[] | []>([]);

  const [createNewOrder, { isLoading: createloading }] =
    useCreateNewOrderMutation();
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
  useEffect(() => {
    if (allBranchesResp && "data" in allBranchesResp) {
      setallBranches(allBranchesResp.data);
    }
  }, [allBranchesResp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone_number) {
      alert("Phone number is required.");
      return;
    }

    createNewOrder({
      ...formData,
      branch_id: activeBranch,
      order_date: new Date().toISOString().toString().split("T")[0],
    })
      .then((item) => {
        if (item.data?.status === 200) {
          toast.success("Success... New order added.");
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
          setTimeout(() => {
            setaddModal(false);
          }, 4000);
        } else {
          toast.error("Order not added. Try again.");
        }
      })
      .catch((err) => {
        toast.error("Try again..");
        console.log(err);
      });
    // Reset
  };

  return (
    <div className="max-h-[100vh]  fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="h-[70vh] max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6 overflow-y-scroll "
      >
        <h2 className="text-2xl font-semibold text-gray-800">Add New Order</h2>
        {/* Branch in Based on roles */}
        {user.role === USER_ROLES.SUPER_ADMIN && (
          <div className="flex justify-between items-center">
            <select
              value={activeBranch}
              onChange={(e) => setactiveBranch(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2"
            >
              {allBranches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
            disabled={createloading}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {createloading ? "Loading..." : "Submit Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
