import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useUpdateuserMutation } from "../redux/apislice";
import { toast, ToastContainer } from "react-toastify";
import { updateUserData } from "../redux/userSlice";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });
  const [updateuser, { isLoading }] = useUpdateuserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await updateuser({
        _id: user._id,
        ...profile,
      });
      if (resp.data?.status === 200) {
        toast.success("User updated successfully!");
        dispatch(
          updateUserData({
            ...user,
            first_name: resp.data.data.first_name,
            last_name: resp.data.data.last_name,
            email: resp.data.data.email,
          })
        );
      } else {
        toast.error("Failed to update user.");
      }
    } catch (err) {
      toast.error("Error updating user.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <ToastContainer />

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        👤 Edit Profile
      </h2>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          First Name
        </label>
        <input
          name="first_name"
          type="text"
          value={profile.first_name}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Last Name
        </label>
        <input
          name="last_name"
          type="text"
          value={profile.last_name}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          name="email"
          type="email"
          value={profile.email}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="pt-4">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isLoading ? "loading" : " Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default Profile;
