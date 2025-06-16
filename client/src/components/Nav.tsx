import React from "react";
import { Link } from "react-router";

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
  return (
    <div className="  w-full flex justify-between items-center mb-20  ">
      <div>
        <p className=" text-[25px] font-[600] text-[#535bf2] ">SafiPro</p>
      </div>
      <div className=" w-[40%] flex justify-evenly  items-center ">
        {list.map((item) => (
          <div key={item.value}>
            <Link to={item.value}>{item.label}</Link>
          </div>
        ))}
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Nav;
