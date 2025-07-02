import { useEffect, useState } from "react";
import {
  useFindAndFilterPaymentMutation,
  useMpesaPaymentMutation,
} from "../redux/apislice";
import type { pagination, Payment } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Payments = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const [payments, setpayments] = useState<Payment[] | []>([]);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [amount] = useState(1000);
  // const [formattedPhone, setFormattedPhone] = useState("");

  const [findAndFilterPayment, { isLoading: findLoading }] =
    useFindAndFilterPaymentMutation();
  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 0,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });

  const [mpesaPayment, { isLoading: mobileLoading }] =
    useMpesaPaymentMutation();
  const navigate = useNavigate();
  const fetchPayments = () => {
    findAndFilterPayment({
      match_values: { user_id: user._id },
      sortBy: "_id:-1",
      limit: paginationdata.limit,
      page: paginationdata.page,
      search: "",
    })
      .then((resp) => {
        if (resp.data?.status === 200) {
          setpayments(resp.data.data.results);
          setpaginationdata({
            page: resp.data.data.page || 0,
            limit: resp.data.data.limit || 10,
            totalPages: resp.data.data.totalPages || 0,
            totalResults: resp.data.data.totalResults || 0,
          });
        } else {
          setpayments([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, [paginationdata.page]);

  const handleMpesaSubmit = () => {
    if (!phoneInput.match(/^07|01\d{8}$/)) {
      alert("Please enter a valid phone number in the format 07XXXXXXXX");
      return;
    }

    const formatted = "+254" + phoneInput.slice(1);
    // setFormattedPhone(formatted);
    setShowMpesaModal(false);

    // Optionally trigger your payment API here
    console.log("Paying with phone:", formatted);
    mpesaPayment({
      user_id: user._id,
      amount: amount,
      email: user.email,
      phone_number: formatted,
    }).then((resp) => {
      if (resp.data?.status) {
        navigate("/confirmation");
      } else {
        toast.error("Try again...");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-blue-800">Payments & Billing</h2>

        <div className="space-y-2">
          <p className="text-gray-700">
            You are currently on the <strong>Basic Plan</strong>.
          </p>
          <p className="text-gray-500">KES 1,000 / month</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm">
          <p>
            Your subscription allows up to <strong>5 branches</strong> and
            <strong> unlimited orders</strong>. You can upgrade anytime for more
            features.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
          {user.subscription.status === "active" ? (
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">
              Active
            </button>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setShowMpesaModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mb-5"
              >
                Pay with M-PESA
              </button>
              <a
                href={import.meta.env.VITE_PAYMENT_URL}
                target="_blank"
                className="mt-10"
              >
                <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50">
                  Pay with Card
                </button>
              </a>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">Payment History</h3>
        <div className="overflow-scroll">
          <div className="h-[50vh] min-w-96   ">
            <table className="w-full text-left border-collapse ">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-sm font-semibold">Date</th>
                  <th className="p-2 text-sm font-semibold">Amount</th>
                  <th className="p-2 text-sm font-semibold">Payment Status</th>
                  <th className="p-2 text-sm font-semibold">Status</th>
                </tr>
              </thead>
              {findLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {payments.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="p-2 text-sm">
                        {new Date(item.created_at).toISOString().split("T")[0]}
                      </td>
                      <td className="p-2 text-sm">
                        KES {item.amount.toLocaleString()}
                      </td>
                      <td className="p-2 text-sm text-green-600 font-medium">
                        {item.payment_status}
                      </td>
                      <td
                        className={`p-2 text-sm ${
                          item.status == "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }  font-medium`}
                      >
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {showMpesaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-800">
              Enter Phone Number
            </h3>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="07XXXXXXXX"
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowMpesaModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-red-500"
              >
                Cancel
              </button>
              <button
                disabled={mobileLoading}
                onClick={handleMpesaSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {mobileLoading ? "Loading..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
