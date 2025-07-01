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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <ToastContainer />

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
