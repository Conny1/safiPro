import React, { useState } from "react";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  PlusCircle,
  Settings,
  List,
} from "lucide-react";
import AddBranchModal from "../components/NewBranch";
import { Link } from "react-router";
import { Listbranches } from "../components";
import { ToastContainer } from "react-toastify";

const Dashboard = () => {
  const [branchModal, setbranchModal] = useState(false);
  const [lisbranchesModal, setlisbranchesModal] = useState(false);
  const stats = [
    { title: "Total Orders", value: 342, icon: <ShoppingCart /> },
    { title: "Completed", value: 290, icon: <BarChart3 /> },
    { title: "Total Revenue", value: "KES 128,000", icon: <DollarSign /> },
  ];

  const allBranches = [
    { id: "1", name: "Westl", location: "Roysambu" },
    { id: "2", name: "Kilii", location: "Westlands" },
  ];
  const recentOrders = [
    {
      order_no: 331,
      name: "Jane Wanjiku",
      amount: 500,
      status: "Pending",
      date: "2025-06-05",
    },
    {
      order_no: 332,
      name: "John Mwangi",
      amount: 1200,
      status: "Completed",
      date: "2025-06-04",
    },
    {
      order_no: 333,
      name: "Lilian Njeri",
      amount: 800,
      status: "In Progress",
      date: "2025-06-03",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <ToastContainer />
      {branchModal && (
        <div>
          <AddBranchModal setbranchModal={setbranchModal} />
        </div>
      )}
      {lisbranchesModal && (
        <div>
          <Listbranches setlisbranchesModal={setlisbranchesModal} />
        </div>
      )}

      <div className="flex justify-between items-center">
        <select
          // value={activeBranch}
          // onChange={(e) => setActiveBranch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          {allBranches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4"
          >
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="text-left w-full">
            <thead className="bg-[#535bf2] flex text-white w-full">
              <tr className="flex w-full mb-4">
                <th className="p-4 w-1/4">Order No.</th>
                <th className="p-4 w-1/4">Name</th>

                {/* <th className="p-4 w-1/4">Phone number</th> */}
                <th className="p-4 w-1/4">Status</th>
                <th className="p-4 w-1/4">-</th>
              </tr>
            </thead>
            <tbody className=" max-h-[40vh] bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full">
              {recentOrders.map((item) => (
                <tr key={item.order_no} className="flex w-full mb-4">
                  <td className="p-4 w-1/4"> {item.order_no} </td>
                  <td className="p-4 w-1/4">{item.name || "-"}</td>
                  {/* <td className="p-4 w-1/4">{item.phone_number}</td> */}
                  <td className="p-4 w-1/4">{item.status}</td>
                  <td className="p-4 w-1/4">
                    <Link to="/orders/101">
                      <button>View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setbranchModal(true)}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <PlusCircle size={18} />
            New brach
          </button>
          <button
            onClick={() => setlisbranchesModal(true)}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            <List size={18} />
            View branches
          </button>
          <Link to="/order">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              <PlusCircle size={18} />
              New Order
            </button>
          </Link>
          <Link to="/settings ">
            <button className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
              <Settings size={18} />
              Settings
            </button>
          </Link>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Revenue Chart</h2>
        <div className="bg-white shadow-md rounded-lg h-64 flex items-center justify-center text-gray-400">
          {/* You can plug in a real chart here later (e.g., Recharts or Chart.js) */}
          Chart Placeholder
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
