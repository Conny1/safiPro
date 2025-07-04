import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../redux/userSlice";
import { persistor, type RootState } from "../redux/store";
import { useEffect } from "react";
import { USER_ROLES } from "../types";

const SubscriptionRequired = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);
  useEffect(() => {
    if (user.role === USER_ROLES.SUPER_ADMIN) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 text-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-red-600">
          Subscription Required
        </h2>

        <p className="text-gray-700">
          Your access has been restricted because your organization's
          subscription is
          <span className="font-semibold text-red-500"> pending</span> or
          <span className="font-semibold text-red-500"> expired</span>.
        </p>

        <p className="text-gray-600 text-sm">
          Please contact your admin to renew or complete the subscription
          payment.
        </p>

        <button
          onClick={() => {
            dispatch(logout());
            persistor.purge();

            navigate("/auth");
          }}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SubscriptionRequired;
