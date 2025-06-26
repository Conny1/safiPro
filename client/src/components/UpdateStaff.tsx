import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import {
  useDeleteUserMutation,
  useGetBranchNamesByuserIdQuery,
  useUpdateuserMutation,
} from "../redux/apislice";
import { roles, type updatestaff, type user } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

type EditStaffProps = {
  userToEdit: user | null;
  seteditmodal: React.Dispatch<React.SetStateAction<boolean>>;
};

const schema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().oneOf(roles).required("Role is required"),
  branch_id: Yup.string().required("Branch is required"),
});

const EditStaff = ({ userToEdit, seteditmodal }: EditStaffProps) => {
  const [updateuser, { isLoading }] = useUpdateuserMutation();
  const user = useSelector((state: RootState) => state.user.value);
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const { data: branchesResp } = useGetBranchNamesByuserIdQuery(user._id);
  const branches = branchesResp?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<updatestaff>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: userToEdit?.first_name,
      last_name: userToEdit?.last_name,
      email: userToEdit?.email,
      role: userToEdit?.role,
      branch_id: userToEdit?.branches?.[0]?.branch_id || "",
    },
  });

  // Reset form when userToEdit changes
  useEffect(() => {
    reset({
      first_name: userToEdit?.first_name,
      last_name: userToEdit?.last_name,
      email: userToEdit?.email,
      role: userToEdit?.role,
      branch_id: userToEdit?.branches?.[0]?.branch_id || "",
    });
  }, [userToEdit, reset]);

  const onSubmit = async (data: any) => {
    try {
      const { branch_id, ...others } = data;
      const resp = await updateuser({
        _id: userToEdit?._id,
        ...others,
        branches: [{ branch_id: data.branch_id, role: data.role }],
        super_admin_id: user._id,
      });
      if (resp.data?.status === 200) {
        toast.success("User updated successfully!");
        setTimeout(() => {
          seteditmodal(false);
        }, 3000);
      } else {
        toast.error("Failed to update user.");
      }
    } catch (err) {
      toast.error("Error updating user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto bg-white p-6 rounded-md shadow space-y-4"
      >
        <ToastContainer />
        <h2 className="text-xl font-bold">Edit Staff Member</h2>

        <input
          type="text"
          placeholder="First Name"
          {...register("first_name")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name.message}</p>
        )}

        <input
          type="text"
          placeholder="Last Name"
          {...register("last_name")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm">{errors.last_name.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <select
          {...register("role")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}

        <select
          {...register("branch_id")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name} - {b.location}
            </option>
          ))}
        </select>
        {errors.branch_id && (
          <p className="text-red-500 text-sm">{errors.branch_id.message}</p>
        )}
        <div className="flex justify-evenly gap-3.5">
          <button
            disabled={deleteLoading}
            onClick={() => {
              deleteUser(userToEdit?._id as string).then((resp) => {
                if (resp.data?.status === 200) {
                  toast.success("Success.. User deleted");
                  setTimeout(() => {
                    seteditmodal(false);
                  }, 1500);
                }
              });
            }}
            className="px-4 py-1 rounded bg-red-600 "
          >
            {deleteLoading ? "Loading..." : "Delete"}
          </button>
          <button
            type="button"
            onClick={() => seteditmodal(false)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isLoading ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaff;
