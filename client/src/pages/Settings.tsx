import React, { useState } from "react";
import { AddnewUser, ListStaff, Profile } from "../components";
import { USER_ROLES } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"system" | "profile">("profile");
  const user = useSelector((state: RootState) => state.user.value);
  return (
    <div className="p-6  mx-auto">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6 justify-end ">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === "profile"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Profile Settings
        </button>
        {user.role === USER_ROLES.SUPER_ADMIN && (
          <button
            onClick={() => setActiveTab("system")}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === "system"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            System Settings
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "system" && user.role === USER_ROLES.SUPER_ADMIN && (
        <div>
          <h2 className="text-lg font-semibold mb-2">🔧 System Settings</h2>

          <AddnewUser />
          <ListStaff />
        </div>
      )}

      {activeTab === "profile" && (
        <div>
          {/* Add user profile form, update password, etc. */}
          <Profile />
        </div>
      )}
    </div>
  );
};

export default Settings;
