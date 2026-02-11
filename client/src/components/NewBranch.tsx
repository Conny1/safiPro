import React, { useState } from "react";
import { useAddnewBranchMutation } from "../redux/apislice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";

type Props = {
  setbranchModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddBranchModal = ({ setbranchModal }: Props) => {
  const [name, setName] = useState("");
  const [location, setlocation] = useState("");
  const [addnewBranch, { isLoading: addloading }] = useAddnewBranchMutation();
  const user = useSelector((state: RootState) => state.user.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location)
      return toast.error("Enter location and name");
    const resp = await addnewBranch({ user_id: user._id, name, location });
    if (resp.data?.status == 200) {
      setName("");
      setbranchModal(false);
    } else {
      toast.error("Try again..");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h3 className="mb-4 text-lg font-semibold">Add New Branch</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-start">
            <span className=""> Name*</span>
            <input
              type="text"
              placeholder="Branch Name"
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="text-start" >
            <span > Location *</span>

            <input
              type="text"
              placeholder="Branch Location"
              required={true}
              value={location}
              onChange={(e) => setlocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setbranchModal(false)}
              type="button"
              className="px-4 py-2 text-white bg-gray-400 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={addloading}
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md"
            >
              {addloading ? "Loading..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranchModal;
