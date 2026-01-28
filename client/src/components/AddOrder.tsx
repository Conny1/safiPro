import React, { useEffect, useState } from "react";
import { USER_ROLES, type addOrder, type Branch } from "../types";
import {
  useCreateNewOrderMutation,
  useGetBranchNamesByBusinessQuery,
} from "../redux/apislice";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  X,
  User,
  Phone,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CreditCard,
  CheckCircle,
  FileText,
  Loader2,
  Building,
  Plus,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { useOrderDB } from "../hooks/useOrderDB";
import useNetworkStatus from "../hooks/useNetworkStatus";
import { generateOrderNo } from "../utils/indexDB/indexedDBManager";

type Props = {
  setaddModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
};

const AddOrder = ({ setaddModal, onSuccess }: Props) => {
  const { isOnline } = useNetworkStatus();
  const { saveOrder: saveOrderWhileOffiline, isReady } = useOrderDB();
  const user = useSelector((state: RootState) => state.user.value);
  const offlineBranchData = useSelector(
    (state: RootState) => state.branch.value,
  );

  const [formData, setFormData] = useState<addOrder>({
    order_no: generateOrderNo(),
    name: "",
    email: "",
    phone_number: "",
    delivery_method: "pickup",
    items_description: "",
    service_type: "Wash Only",
    pickup_date: "",
    amount: 0,
    payment_status: "pending",
    payment_method: "cash",
    status: "pending",
    is_completed: false,
    notes: "",
    address: "",
  });
  const [submitForm, setsubmitForm] = useState(false);

  const [activeBranch, setactiveBranch] = useState(
    user.role === USER_ROLES.SUPER_ADMIN
      ? ""
      : user.branches[0]?.branch_id || "",
  );

  const { data: allBranchesResp } = useGetBranchNamesByBusinessQuery(
    undefined,
    {
      skip: user.role !== USER_ROLES.SUPER_ADMIN,
    },
  );

  const [allBranches, setallBranches] = useState<Branch[] | []>(
    offlineBranchData,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [createNewOrder, { isLoading: createloading }] =
    useCreateNewOrderMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

  useEffect(() => {
    if (allBranchesResp && "data" in allBranchesResp) {
      setallBranches(allBranchesResp.data);
      // dispatch(updatebranchData( allBranchesResp.data ) )
      if (
        !activeBranch &&
        (allBranchesResp.data.length > 0 || offlineBranchData.length > 0)
      ) {
        let id =
          (allBranchesResp.data[0]._id as string) || offlineBranchData[0]._id;
        setactiveBranch(id);
      }
    }
  }, [allBranchesResp, isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm) return;
    if (!formData.phone_number || !formData.name || !formData.pickup_date) {
      toast.error("Fill all the required fields..");

      return;
    }

    if (!activeBranch) {
      toast.error("Please select a branch");
      return;
    }

    try {
      let status;
      if (isOnline) {
        const result = await createNewOrder({
          ...formData,
          branch_id: activeBranch,
          order_date: new Date().toISOString().split("T")[0],
        });
        status = result.data?.status;
        console.log("online save");
      } else {
        const result = await saveOrderWhileOffiline({
          ...formData,
          branch_id: activeBranch,
          order_date: new Date().toISOString().split("T")[0],
        });
        status = result.status;
        console.log("offline save");
      }

      if (status && status === 200) {
        toast.success(`Order created successfully!`);

        // Reset form
        setFormData({
          order_no: "",
          name: "",
          email: "",
          phone_number: "",
          delivery_method: "pickup",
          items_description: "",
          service_type: "Wash Only",
          pickup_date: "",
          amount: 0,
          payment_status: "pending",
          payment_method: "cash",
          status: "pending",
          is_completed: false,
          notes: "",
          address: "",
          branch_id: "",
        });
        onSuccess?.();
        setTimeout(() => {
          setaddModal(false);
        }, 1500);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
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

  const nextStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.phone_number || !formData.name) {
          toast.error("Fill all the required fields..");

          return;
        }
        break;
      case 2:
        if (!formData.pickup_date) {
          toast.error("Fill all the required fields..");

          return;
        }
        if (!formData.amount) {
          toast.error("Amount cannot be 0");
          return;
        }
        break;
    }
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Order
            </h2>
            <p className="text-gray-600">Fill in the order details below</p>
          </div>
          <button
            onClick={() => setaddModal(false)}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-8 overflow-auto ">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium
                    ${
                      step === currentStep
                        ? "bg-blue-600 text-white"
                        : step < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {step === 1 && "Customer Info"}
                    {step === 2 && "Order Details"}
                    {step === 3 && "Payment & Status"}
                  </p>
                </div>
                {step < 3 && (
                  <div
                    className={`h-0.5 w-16 mx-4 ${
                      step < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 px-6 pb-6 overflow-y-auto"
        >
          {/* Branch Selection */}
          {user.role === USER_ROLES.SUPER_ADMIN && (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Branch
              </label>
              <div className="relative">
                <Building className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <select
                  value={activeBranch}
                  onChange={(e) => setactiveBranch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="">Select a branch</option>
                  {allBranches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 1: Customer Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <User className="inline w-4 h-4 mr-2" />
                    Customer Name*{" "}
                    <span className="text-sm font-bold text-red-600 ">
                      (required)
                    </span>
                  </label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                {/* <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="customer@example.com"
                  />
                </div> */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Phone Number *{" "}
                    <span className="text-sm font-bold text-red-600 ">
                      (required)
                    </span>
                  </label>
                  <input
                    name="phone_number"
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0712 345 678"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Order Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Pickup/Delivery Date *{" "}
                    <span className="text-sm font-bold text-red-600 ">
                      (required)
                    </span>
                  </label>
                  <input
                    name="pickup_date"
                    type="date"
                    required
                    value={formData.pickup_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <DollarSign className="inline w-4 h-4 mr-2" />
                    Amount (KES) *
                    <span className="text-sm font-bold text-red-600 ">
                      (required)
                    </span>
                  </label>
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="500.00"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Package className="inline w-4 h-4 mr-2" />
                    Service Type
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {serviceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Truck className="inline w-4 h-4 mr-2" />
                    Delivery Method
                  </label>
                  <select
                    name="delivery_method"
                    value={formData.delivery_method}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {deliveryMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <ShoppingBag className="inline w-4 h-4 mr-2" />
                    Items Description
                  </label>
                  <textarea
                    name="items_description"
                    value={formData.items_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Example: 3 Shirts, 2 Trousers, 1 Jacket..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment & Status */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <CreditCard className="inline w-4 h-4 mr-2" />
                    Payment Method
                  </label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <CheckCircle className="inline w-4 h-4 mr-2" />
                    Payment Status
                  </label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial Payment</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Order Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="washing">Washing</option>
                    <option value="drying">Drying</option>
                    <option value="ironing">Ironing</option>
                    <option value="completed">Completed</option>
                    <option value="ready">Ready for pickup/delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {showAdvanced ? "Hide" : "Show"} Advanced Options
                  <Plus
                    className={`w-4 h-4 transition-transform ${
                      showAdvanced ? "rotate-45" : ""
                    }`}
                  />
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
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
                        This will automatically set status to completed
                      </p>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        <FileText className="inline w-4 h-4 mr-2" />
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Special instructions, customer preferences, etc."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-between gap-2 pt-8 ">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setaddModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={() => setsubmitForm(true)}
                  disabled={createloading}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50"
                >
                  {createloading ? (
                    <>
                      <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    "Create Order"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Step Indicator */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Step {currentStep} of 3</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;
