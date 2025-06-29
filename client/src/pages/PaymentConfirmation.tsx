import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useGetauthuserQuery } from "../redux/apislice";

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(240); // 240 seconds
  const hasRedirected = useRef(false); // 👈 Flag to prevent double redirects
  const { data } = useGetauthuserQuery(undefined, {
    pollingInterval: 60000,
  });
  useEffect(() => {
    if (
      data &&
      data.data.subscription?.status === "active" &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;

      navigate("/dashboard");
    }
  }, [data, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            navigate("/dashboard");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec < 10 ? "0" : ""}${sec}s`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center space-y-6">
        <h2 className="text-2xl font-bold text-blue-800">
          Confirm Your Payment
        </h2>
        <p className="text-gray-700 text-lg">
          An STK Push has been sent to your M-PESA phone number.
        </p>
        <p className="text-gray-600">
          Please complete the transaction on your phone.
        </p>
        <p className="text-sm text-gray-500">
          After successful payment, you will be redirected automatically.
        </p>
        <p className="text-sm text-gray-400">
          If not completed, you'll be redirected after{" "}
          <strong>{formatTime(countdown)}</strong>
        </p>

        <div className="mt-4">
          <svg
            className="animate-spin h-8 w-8 mx-auto text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
