import React, { useState } from "react";
import { AddOrder } from "../components";
import { Link } from "react-router";

const Orders = () => {
  const [addModal, setaddModal] = useState(false);
  const orders = [
    {
      order_no: 1001,
      name: "Jane Wanjiku",
      email: "jane.wanjiku@example.com",
      phone_number: "0712345678",
      amount: 500,
      payment_status: "pending",
      payment_method: "cash",
      status: "pending",
      order_date: "2025-06-01",
      pickup_date: "2025-06-03",
      service_type: "Wash & Fold",
      items_description: "3 shirts, 2 trousers",
      delivery_method: "Pickup",
      is_completed: false,
      notes: "Use mild detergent",
    },
    {
      order_no: 1002,
      name: "David Kiptoo",
      email: "david.kiptoo@example.com",
      phone_number: "0723456789",
      amount: 850,
      payment_status: "paid",
      payment_method: "M-Pesa",
      status: "completed",
      order_date: "2025-05-30",
      pickup_date: "2025-06-01",
      service_type: "Dry Cleaning",
      items_description: "1 suit, 1 jacket",
      delivery_method: "Customer drop-off",
      is_completed: true,
      notes: "",
    },
    {
      order_no: 1003,
      name: "Aisha Abdalla",
      email: "aisha.abdalla@example.com",
      phone_number: "0734567890",
      amount: 700,
      payment_status: "pending",
      payment_method: "cash",
      status: "in-progress",
      order_date: "2025-06-02",
      pickup_date: "2025-06-05",
      service_type: "Ironing",
      items_description: "4 dresses, 2 shirts",
      delivery_method: "Pickup",
      is_completed: false,
      notes: "Do not starch",
    },
    {
      order_no: 1004,
      name: "Brian Ochieng",
      email: "brian.ochieng@example.com",
      phone_number: "0745678901",
      amount: 600,
      payment_status: "paid",
      payment_method: "M-Pesa",
      status: "completed",
      order_date: "2025-05-28",
      pickup_date: "2025-05-30",
      service_type: "Wash Only",
      items_description: "5 t-shirts, 3 jeans",
      delivery_method: "Customer drop-off",
      is_completed: true,
      notes: "",
    },
    {
      order_no: 1005,
      name: "Grace Wambui",
      email: "grace.wambui@example.com",
      phone_number: "0756789012",
      amount: 1200,
      payment_status: "pending",
      payment_method: "cash",
      status: "pending",
      order_date: "2025-06-04",
      pickup_date: "2025-06-07",
      service_type: "Full Service",
      items_description: "10 kg mixed laundry",
      delivery_method: "Pickup",
      is_completed: false,
      notes: "Separate whites",
    },
    {
      order_no: 1006,
      name: "Elvis Mutua",
      email: "elvis.mutua@example.com",
      phone_number: "0767890123",
      amount: 300,
      payment_status: "paid",
      payment_method: "cash",
      status: "completed",
      order_date: "2025-05-29",
      pickup_date: "2025-06-01",
      service_type: "Wash & Iron",
      items_description: "3 shirts",
      delivery_method: "Customer drop-off",
      is_completed: true,
      notes: "",
    },
    {
      order_no: 1007,
      name: "Nancy Chepkemoi",
      email: "nancy.chel@example.com",
      phone_number: "0778901234",
      amount: 450,
      payment_status: "pending",
      payment_method: "cash",
      status: "in-progress",
      order_date: "2025-06-03",
      pickup_date: "2025-06-06",
      service_type: "Wash Only",
      items_description: "6 t-shirts",
      delivery_method: "Pickup",
      is_completed: false,
      notes: "Fold neatly",
    },
    {
      order_no: 1008,
      name: "Peter Njoroge",
      email: "peter.njoroge@example.com",
      phone_number: "0789012345",
      amount: 750,
      payment_status: "paid",
      payment_method: "M-Pesa",
      status: "completed",
      order_date: "2025-05-31",
      pickup_date: "2025-06-02",
      service_type: "Dry Cleaning",
      items_description: "2 coats, 1 blazer",
      delivery_method: "Customer drop-off",
      is_completed: true,
      notes: "",
    },
    {
      order_no: 1009,
      name: "Linda Anyango",
      email: "linda.anyango@example.com",
      phone_number: "0790123456",
      amount: 1000,
      payment_status: "pending",
      payment_method: "cash",
      status: "pending",
      order_date: "2025-06-04",
      pickup_date: "2025-06-06",
      service_type: "Wash & Fold",
      items_description: "5 dresses, 2 skirts",
      delivery_method: "Pickup",
      is_completed: false,
      notes: "No bleach",
    },
    {
      order_no: 1010,
      name: "Samuel Kariuki",
      email: "sam.kariuki@example.com",
      phone_number: "0701234567",
      amount: 650,
      payment_status: "paid",
      payment_method: "M-Pesa",
      status: "in-progress",
      order_date: "2025-06-03",
      pickup_date: "2025-06-05",
      service_type: "Ironing",
      items_description: "5 trousers",
      delivery_method: "Customer drop-off",
      is_completed: false,
      notes: "Iron sharp creases",
    },
  ];

  return (
    <div className=" ">
      <div className="flex w-full justify-end  ">
        <button
          onClick={() => setaddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Order
        </button>
        {addModal && (
          <div className="p-4 absolute w-full  ">
            <AddOrder setaddModal={setaddModal} />
          </div>
        )}
      </div>
      <div className=" w-full mt-10  ">
        <table className="text-left w-full">
          <thead className="bg-[#535bf2] flex text-white w-full">
            <tr className="flex w-full mb-4">
              <th className="p-4 w-1/4">Order No.</th>
              <th className="p-4 w-1/4">Name</th>

              <th className="p-4 w-1/4">Phone number</th>
              <th className="p-4 w-1/4">Status</th>
              <th className="p-4 w-1/4">-</th>
            </tr>
          </thead>
          <tbody className=" h-[70vh] bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full">
            {orders.map((item) => (
              <tr key={item.order_no} className="flex w-full mb-4">
                <td className="p-4 w-1/4"> {item.order_no} </td>
                <td className="p-4 w-1/4">{item.name || "-"}</td>
                <td className="p-4 w-1/4">{item.phone_number}</td>
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
        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-slate-500">
            Showing <b>1-5</b> of 45
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              Prev
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
              1
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              2
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              3
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
