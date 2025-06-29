import { useEffect, useState } from "react";
import { AddOrder } from "../components";
import { Link } from "react-router";
import type { Order, pagination } from "../types";
import { useFindAndFilterOrderMutation } from "../redux/apislice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Orders = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const [addModal, setaddModal] = useState(false);
  const [orders, setorders] = useState<Order[] | []>([]);
  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 0,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });

  const [findAndFilterOrder, { isLoading: fetchloading }] =
    useFindAndFilterOrderMutation();

  const fetchOrders = () => {
    findAndFilterOrder({
      match_values: { branch_id: user.branches.map((val) => val?.branch_id) },
      sortBy: "_id:-1",
      limit: paginationdata.limit,
      page: paginationdata.page,
      search: "",
    })
      .then((resp) => {
        if (resp.data?.status === 200) {
          setorders(resp.data.data.results);
          setpaginationdata({
            page: resp.data.data.page || 0,
            limit: resp.data.data.limit || 10,
            totalPages: resp.data.data.totalPages || 0,
            totalResults: resp.data.data.totalResults || 0,
          });
        } else {
          setorders([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchOrders();
  }, [paginationdata.page, addModal]);

  return (
    <div className="">
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
      <div className=" w-full mt-10   overflow-x-scroll lg:overflow-x-hidden ">
        <table className="text-left w-full ">
          <thead className="bg-[#535bf2] flex text-white w-full">
            <tr className="flex w-full mb-4">
              <th className="p-4 w-1/4">Order No.</th>
              <th className="p-4 w-1/4">Name</th>

              <th className="p-4 w-1/4">Phone number</th>
              <th className="p-4 w-1/4">Status</th>
              <th className="p-4 w-1/4">-</th>
            </tr>
          </thead>
          {fetchloading ? (
            <p>Loading...</p>
          ) : (
            <tbody className=" bg-grey-light flex flex-col items-center  overflow-y-scroll w-full">
              {orders.map((item) => (
                <tr key={item._id} className=" flex w-full mb-4">
                  <td className="p-4 w-1/4"> {item.order_no} </td>
                  <td className="p-4 w-1/4">{item.name || "-"}</td>
                  <td className="p-4 w-1/4">{item.phone_number}</td>
                  <td className="p-4 w-1/4">
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full
                          ${
                            item.status === "completed" &&
                            "bg-green-100 text-green-700"
                          }
                          ${
                            item.status === "pending" &&
                            "bg-yellow-100 text-yellow-700"
                          }
                          ${
                            item.status === "in-progress" &&
                            "bg-blue-100 text-blue-700"
                          }
                        `}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 w-1/4">
                    <Link to={`/orders/${item._id}`}>
                      <button>View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="flex justify-between items-center px-4 py-3">
        <div className="text-sm text-slate-500">
          Showing <b>{paginationdata.page} </b> of {paginationdata.totalPages}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => {
              setpaginationdata((prev) => ({
                ...prev,

                page: prev.page === 1 ? 1 : -1,
              }));
            }}
            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
          >
            Prev
          </button>

          <button
            onClick={() => {
              setpaginationdata((prev) => ({
                ...prev,

                page: prev.page === paginationdata.totalPages ? prev.page : +1,
              }));
            }}
            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
