import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { updateUserData } from "../redux/userSlice";

const Nav = () => {
  let list = [
    {
      value: "/",
      label: "Dashboard",
    },
    {
      label: "Orders",
      value: "order",
    },

    {
      label: "Settings",
      value: "settings",
    },
  ];
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(
      updateUserData({
        first_name: "",
        last_name: "",
        email: "",
        token: "",
        _id: "",
        subscription_data: {},
      })
    );
  };
  return (
    <div className="  w-full flex justify-between items-center mb-5  ">
      <div>
        <p className=" text-[25px] font-[600] text-[#535bf2] ">SafiPro</p>
      </div>
      <div className=" w-[40%] flex justify-evenly  items-center ">
        {list.map((item) => (
          <div key={item.value}>
            <Link to={item.value}>{item.label}</Link>
          </div>
        ))}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Nav;
