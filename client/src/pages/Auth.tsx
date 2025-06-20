import React, { useEffect, useState } from "react";
import { Login, Signup } from "../components";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const path = useLocation().pathname.match("/auth");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (user.token) {
      if (path) {
        navigate("/");
      }
    }
  }, [path, user.token, navigate]);

  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <ToastContainer />

      {isLogin ? (
        <Login onSwitch={toggleForm} />
      ) : (
        <Signup onSwitch={toggleForm} />
      )}
    </div>
  );
};

export default Auth;
