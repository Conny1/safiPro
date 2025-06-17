import React, { useState } from "react";

type Props = {
  setbranchModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddBranchModal = ({ setbranchModal }: Props) => {
  const [name, setName] = useState("");
  const [location, setlocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setName("");
    setbranchModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
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
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranchModal;
