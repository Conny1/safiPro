import React, { useEffect, useState } from "react";
import type { Branch, pagination } from "../types";
import {
  useDeleteBranchMutation,
  useFindAndFilterBranchMutation,
  useUpdateBranchMutation,
} from "../redux/apislice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";

type Props = {
  setlisbranchesModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Listbranches = ({ setlisbranchesModal }: Props) => {
  const [localBranches, setLocalBranches] = useState<Branch[] | []>([]);
  const user = useSelector((state: RootState) => state.user.value);
  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 0,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  const [findAndFilterBranch, { isLoading: fetchloading }] =
    useFindAndFilterBranchMutation();
  const [updateBranch, { isLoading: updateloading }] =
    useUpdateBranchMutation();
  const [deleteBranch, { isLoading: deleteLoading }] =
    useDeleteBranchMutation();
  const fetchBranches = () => {
    findAndFilterBranch({
      match_values: { user_id: user._id },
      sortBy: "_id:-1",
      limit: paginationdata.limit,
      page: paginationdata.page,
      search: "",
    })
      .then((resp) => {
        if (resp.data?.status === 200) {
          setLocalBranches(resp.data.data.results);
          setpaginationdata({
            page: resp.data.data.page || 0,
            limit: resp.data.data.limit || 10,
            totalPages: resp.data.data.totalPages || 0,
            totalResults: resp.data.data.totalResults || 0,
          });
        } else {
          setLocalBranches([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchBranches();
  }, [paginationdata.page, deleteLoading]);

  const handleChange = (
    id: string | undefined,
    key: keyof Branch,
    value: string
  ) => {
    setLocalBranches((prev) =>
      prev.map((b) => (b._id === id ? { ...b, [key]: value } : b))
    );
  };

  const handleSaveBranch = async (branch: Branch) => {
    // TODO: replace this with API call to update that one branch
    console.log("Updating branch:", branch);
    const resp = await updateBranch(branch);
    if (resp.data?.status === 200) {
      toast.success("Success..Updated.");
    } else {
      toast.error("Try again.");
    }
  };

  return (
    <div className="max-h-[100vh] overflow-y-scroll fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      {fetchloading ? (
        <p>fetching data..</p>
      ) : (
        <div className="h-[70vh] overflow-y-scroll bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
          <h2 className="text-xl font-bold mb-4">Manage Branches</h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {localBranches.map((branch) => (
              <div key={branch._id} className="border p-3 rounded-md space-y-2">
                <div>
                  <label className="text-sm font-medium">Branch Name</label>
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) =>
                      handleChange(branch?._id, "name", e.target.value)
                    }
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input
                    type="text"
                    value={branch.location}
                    onChange={(e) =>
                      handleChange(branch?._id, "location", e.target.value)
                    }
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>

                <div className="text-right flex gap-3 flex-wrap ">
                  <button
                    disabled={deleteLoading}
                    onClick={() => {
                      deleteBranch(branch._id as string).then((resp) => {
                        if (resp.data?.status === 200) {
                          toast.success("Success.. Branch deleted");
                        }
                      });
                    }}
                    className="px-4 py-1 rounded bg-red-600 "
                  >
                    {deleteLoading ? "Loading..." : "Delete"}
                  </button>
                  <button
                    onClick={() => handleSaveBranch(branch)}
                    disabled={updateloading}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    {updateloading ? "Loading.." : "update"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <div className="text-sm text-slate-500">
              Showing <b>{paginationdata.page} </b> of{" "}
              {paginationdata.totalPages}
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

                    page:
                      prev.page === paginationdata.totalPages ? prev.page : +1,
                  }));
                }}
                className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
              >
                Next
              </button>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={() => setlisbranchesModal(false)}
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listbranches;
