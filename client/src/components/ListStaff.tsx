import {  useMemo, useState } from "react";
import type { pagination, user } from "../types";

import { UpdateStaff } from ".";
import { useFindAndFilterUserQuery } from "../redux/apislice";
import { LoaderIcon } from "lucide-react";

const ListStaff = () => {
  const [editmodal, seteditmodal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  const [filters, setfilters] = useState({
    match_values: {},
    sortBy: "_id:-1",
    limit: 10,
    page: 1,
    search: "",
  });
  const { data, isLoading: findloading } = useFindAndFilterUserQuery(filters);
  const staff = useMemo(() => {
    if(data?.data){
        setpaginationdata({
            page: data.data.page || 1,
            limit: data.data.limit || 10,
            totalPages: data.data.totalPages || 0,
            totalResults: data.data.totalResults || 0,
          });
          return data.data.results
    }
    return []
  }, [filters.page, data,editmodal ])
 if(findloading) return <> <LoaderIcon /> <p>Loading...</p> </> 


  return (
    <div className="space-y-8">
      {editmodal && (
        <div className="">
          <UpdateStaff userToEdit={selectedUser} seteditmodal={seteditmodal} />
        </div>
      )}
      <div className="overflow-x-scroll">
        <div className=" min-w-[700px] bg-white shadow-md rounded-lg   ">
          <table className="flex flex-col items-center w-full bg-grey-light">
            <thead className="bg-[#535bf2] flex text-white w-full">
              <tr className="flex w-full mb-4">
                <th className="w-1/4 p-4">Name.</th>
                <th className="w-1/4 p-4">email</th>

                {/* <th className="w-1/4 p-4">Phone number</th> */}
                <th className="w-1/4 p-4">role</th>
                <th className="w-1/4 p-4">-</th>
              </tr>
            </thead>
            {findloading ? (
              <p>Loading...</p>
            ) : (
              <tbody className="  max-h-[50vh] bg-grey-light flex flex-col items-center  w-full">
                {staff.map((item) => (
                  <tr key={item._id} className="flex w-full mb-4">
                    <td className="w-1/4 p-4">
                      {item.first_name + " "} {item.last_name}{" "}
                    </td>
                    <td className="w-1/4 p-4 ">{item.email || "-"}</td>
                    <td className="w-1/4 p-4">{item.role}</td>

                    <td className="w-1/4 p-4">
                      <button
                        onClick={() => {
                          setSelectedUser(item);
                          seteditmodal(true);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    {/* {editmodal && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black lg:top-0 lg:bg-black">
                        <UpdateStaff
                          seteditmodal={seteditmodal}
                          userToEdit={item}
                        />
                      </div> */}
                    {/* )} */}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 ">
        <div className="text-sm text-slate-500">
          Showing <b>{paginationdata.page} </b> of {paginationdata.totalPages}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => {
              setfilters((prev) => ({
                ...prev,

                page: prev.page === 1 ? 1 : prev.page - 1,
              }));
            }}
            className="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease"
          >
            Prev
          </button>

          <button
            onClick={() => {
              setfilters((prev) => ({
                ...prev,

                page: prev.page < paginationdata.totalPages ? prev.page + 1 : prev.page,
              }));
            }}
            className="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListStaff;
