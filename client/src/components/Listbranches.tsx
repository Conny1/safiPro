import React, { useState } from "react";
import type { Branch } from "../types";

type Props = {
  branches: Branch[];
  setlisbranchesModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Listbranches = ({ branches, setlisbranchesModal }: Props) => {
  const [localBranches, setLocalBranches] = useState<Branch[]>(branches);

  const handleChange = (id: string, key: keyof Branch, value: string) => {
    setLocalBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b))
    );
  };

  const handleSaveBranch = (branch: Branch) => {
    // TODO: replace this with API call to update that one branch
    console.log("Updating branch:", branch);
  };

  return (
    <div className="max-h-[100vh] overflow-y-scroll fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-bold mb-4">Manage Branches</h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {localBranches.map((branch) => (
            <div key={branch.id} className="border p-3 rounded-md space-y-2">
              <div>
                <label className="text-sm font-medium">Branch Name</label>
                <input
                  type="text"
                  value={branch.name}
                  onChange={(e) =>
                    handleChange(branch.id, "name", e.target.value)
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
                    handleChange(branch.id, "location", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div className="text-right">
                <button
                  onClick={() => handleSaveBranch(branch)}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={() => setlisbranchesModal(false)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listbranches;
