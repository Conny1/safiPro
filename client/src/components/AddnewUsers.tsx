import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import {
  useCreateStaffAccountMutation,
  useGetBranchNamesByuserIdQuery,
} from "../redux/apislice";
import { roles, type createAccount } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const schema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  repeat_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Repeat password is required"),
  role: Yup.string().oneOf(roles).required("Role is required"),
  branch_id: Yup.string().required("Branch is required"),
});

const AddNewUser = () => {
  const [createStaffAccount, { isLoading }] = useCreateStaffAccountMutation();
  const user = useSelector((state: RootState) => state.user.value);
  const { data: branchesResp } = useGetBranchNamesByuserIdQuery(user._id);
  const branches = branchesResp?.data;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createAccount & { role: string; branch_id: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const { branch_id, ...userData } = data;
      const resp = await createStaffAccount({
        ...userData,
        branches: [{ branch_id, role: data.role }],
        super_admin_id: user._id,
      });
      if (resp.data?.status === 200) {
        toast.success("User created successfully!");
      } else {
        console.log(resp);
        if (resp?.error && "status" in resp?.error) {
          if (resp?.error.status === 400) {
            toast.error("Email in use.");
          }
        } else {
          toast.error("Failed to create user");
        }
      }
    } catch (err) {
      toast.error("Error creating user");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto bg-white p-6 rounded-md shadow space-y-4"
    >
      <ToastContainer />
      <h2 className="text-xl font-bold">Add New User</h2>

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

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
        className="w-full border px-3 py-2 rounded"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <input
        type="password"
        placeholder="Repeat Password"
        {...register("repeat_password")}
        className="w-full border px-3 py-2 rounded"
      />
      {errors.repeat_password && (
        <p className="text-red-500 text-sm">{errors.repeat_password.message}</p>
      )}

      <select {...register("role")} className="w-full border px-3 py-2 rounded">
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
        {branches?.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name} - {b.location}
          </option>
        ))}
      </select>
      {errors.branch_id && (
        <p className="text-red-500 text-sm">{errors.branch_id.message}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isLoading ? "Creating..." : "Add User"}
      </button>
    </form>
  );
};

export default AddNewUser;
