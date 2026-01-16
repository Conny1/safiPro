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
    if (!name.trim()) return;
    const resp = await addnewBranch({ user_id: user._id, name, location });
    if (resp.data?.status == 200) {
      setName("");
      setbranchModal(false);
    } else {
      toast.error("Try again..");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Add New Branch</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Branch Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Branch Location"
            value={location}
            onChange={(e) => setlocation(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setbranchModal(false)}
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={addloading}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
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
