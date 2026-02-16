import { useEffect, useState } from "react";
import { Forgotpassword, Login, Signup } from "../components";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const path = useLocation().pathname.match("/auth");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.value);
  const [forgotpassword, setforgotpassword] = useState(false);

  useEffect(() => {
    if (user.token) {
      if (path) {
        navigate("/dashboard");
      }
    }
  }, [path, user.token, navigate]);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setforgotpassword(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 px-4 bg-gray-100">
      <ToastContainer />
      <button
        onClick={() => {
          navigate("/");
        }}
        className="px-6 py-2 mt-4 text-white transition bg-blue-600 rounded hover:bg-blue-700"
      >
        Back to Home page
      </button>

      {forgotpassword ? (
        <Forgotpassword onSwitch={toggleForm} />
      ) : isLogin ? (
        <Login onSwitch={toggleForm} setforgotpassword={setforgotpassword} />
      ) : (
        <Signup onSwitch={toggleForm} />
      )}
    </div>
  );
};

export default Auth;
