import React from "react";
import { useParams } from "react-router";
import type { Order } from "../types";

const dummyOrders: Order[] = [
  {
    order_no: 101,
    name: "Jane Wanjiku",
    email: "jane@example.com",
    phone_number: "0712345678",
    amount: 850,
    payment_status: "paid",
    payment_method: "M-Pesa",
    status: "completed",
    order_date: "2025-06-01",
    pickup_date: "2025-06-03",
    service_type: "Wash & Fold",
    items_description: "3 shirts, 2 trousers, 1 bedsheet",
    delivery_method: "Pickup",
    is_completed: true,
    notes: "Handle shirts gently",
  },
];

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
  const { id } = useParams();
  const order = dummyOrders.find((o) => o.order_no.toString() === id);

  if (!order) {
    return <p className="text-center text-gray-500 mt-10">Order not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Order #{order.order_no}
        </h1>
        <p className="text-gray-500 text-sm">Placed on {order.order_date}</p>
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
            <strong>Amount:</strong> KES {order.amount.toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {order.payment_status}
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
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Completed:</strong> {order.is_completed ? "Yes" : "No"}
          </p>
          <p>
            <strong>Delivery Method:</strong> {order.delivery_method}
          </p>
          <p>
            <strong>Pickup Date:</strong> {order.pickup_date}
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
    </div>
  );
};

export default OrderDetails;
