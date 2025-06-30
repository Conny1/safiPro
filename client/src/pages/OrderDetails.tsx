import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
} from "../redux/apislice";
import { ForwardButtons, UpdateOrder } from "../components";
import { toast } from "react-toastify";

const InfoBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-100 p-4 rounded-md">
    <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
    <div className="text-sm text-gray-800 space-y-1">{children}</div>
  </div>
);

const OrderDetails = () => {
  const [updateModal, setupdateModal] = useState(false);
  const { id } = useParams();
  const { data, isLoading } = useGetOrderByIdQuery(id as string);
  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation();
  const navigate = useNavigate();
  const order = data?.data;
  if (isLoading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  } else if (!order) {
    return <p className="text-center text-gray-500 mt-10">Order not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      {updateModal && (
        <div>
          <UpdateOrder setupdateModal={setupdateModal} orderData={order} />
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Order #{order.order_no}
        </h1>
        <p className="text-gray-500 text-sm">
          Placed on {(order.order_date as string).split("T")[0]}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoBlock title="Customer">
          <p>
            <strong>Name:</strong> {order.name || "—"}
          </p>
          <p>
            <strong>Email:</strong> {order.email || "—"}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone_number}
          </p>
        </InfoBlock>

        <InfoBlock title="Payment Details">
          <p>
            <strong>Amount:</strong> KES{" "}
            {(order.amount as number).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full
      ${order.payment_status === "paid" && "bg-green-100 text-green-700"}
      ${order.payment_status === "pending" && "bg-yellow-100 text-yellow-700"}
     
    `}
            >
              {order.status}
            </span>
          </p>
          <p>
            <strong>Method:</strong> {order.payment_method}
          </p>
        </InfoBlock>

        <InfoBlock title="Service Info">
          <p>
            <strong>Service Type:</strong> {order.service_type}
          </p>
          <p>
            <strong>Items:</strong> {order.items_description}
          </p>
        </InfoBlock>

        <InfoBlock title="Status & Delivery">
          <p>
            <strong>Status:</strong>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full
      ${order.status === "completed" && "bg-green-100 text-green-700"}
      ${order.status === "pending" && "bg-yellow-100 text-yellow-700"}
      ${order.status === "in-progress" && "bg-blue-100 text-blue-700"}
    `}
            >
              {order.status}
            </span>
          </p>
          <p>
            <strong>Completed:</strong> {order.is_completed ? "Yes" : "No"}
          </p>
          <p>
            <strong>Delivery Method:</strong> {order.delivery_method}
          </p>
          <p>
            <strong>Pickup Date:</strong>{" "}
            {(order.pickup_date as string).split("T")[0]}
          </p>
        </InfoBlock>

        {order.notes && (
          <div className="md:col-span-2">
            <InfoBlock title="Additional Notes">
              <p>{order.notes}</p>
            </InfoBlock>
          </div>
        )}
      </div>
      <div className="  flex justify-between gap-6  flex-wrap-reverse items-center ">
        <div className="flex gap-3 flex-wrap items-center ">
          <button
            disabled={deleteLoading}
            onClick={() => {
              deleteOrder(id as string).then((resp) => {
                if (resp.data?.status === 200) {
                  toast.success("Success.. Order deleted");
                  setTimeout(() => {
                    navigate("/order");
                  }, 2000);
                }
              });
            }}
            className="mt-10 bg-red-600 "
          >
            {deleteLoading ? "Loading..." : "Delete"}
          </button>
          <button onClick={() => setupdateModal(true)} className="mt-10">
            Update
          </button>
        </div>
        <ForwardButtons
          message="Hello, your laundry is ready for collection. Kindly pick it up at your convenience."
          phone_number={order.phone_number as string}
        />
      </div>
    </div>
  );
};

export default OrderDetails;
