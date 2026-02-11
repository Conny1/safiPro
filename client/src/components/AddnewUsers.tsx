import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import {
  useCreateStaffAccountMutation,
  useGetBranchNamesByBusinessQuery,
} from "../redux/apislice";
import { roles, type createAccount } from "../types";

const schema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  repeat_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Repeat password is required"),
  role: Yup.string().oneOf(roles).required("Role is required"),
  branch_id: Yup.string().required("Branch is required"),
});

const AddNewUser = () => {
  const [createStaffAccount, { isLoading }] = useCreateStaffAccountMutation();
  const { data: branchesResp } = useGetBranchNamesByBusinessQuery();
  const branches = branchesResp?.data;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createAccount & { role: string; branch_id: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (
    data: createAccount & { role: string; branch_id: string },
  ) => {
    try {
      const { branch_id, ...userData } = data;
      const resp = await createStaffAccount({
        ...userData,
        branches: [{ branch_id, role: data.role }],
      });
      if (resp.data?.status === 200) {
        toast.success("User created successfully!");
      } else {
        console.log(resp);
        if (resp?.error && "status" in resp?.error) {
          if (resp?.error.status === 400) {
            toast.error("Email in use.");
          } else {
            if (resp.error && "data" in resp.error && resp.error.data) {
              let data = resp.error.data as { message: string };
              let message = data.message || "Try again.";
              toast.error(message);
            }
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
      className="w-full max-w-md p-1 mx-auto space-y-4 bg-white rounded-md shadow"
    >
      <ToastContainer />
      <h2 className="text-xl font-bold">Add New User</h2>

      <input
        type="text"
        placeholder="First Name"
        {...register("first_name")}
        className="w-full px-3 py-2 border rounded"
      />
      {errors.first_name && (
        <p className="text-sm text-red-500">{errors.first_name.message}</p>
      )}

      <input
        type="text"
        placeholder="Last Name"
        {...register("last_name")}
        className="w-full px-3 py-2 border rounded"
      />
      {errors.last_name && (
        <p className="text-sm text-red-500">{errors.last_name.message}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="w-full px-3 py-2 border rounded"
      />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
        className="w-full px-3 py-2 border rounded"
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}

      <input
        type="password"
        placeholder="Repeat Password"
        {...register("repeat_password")}
        className="w-full px-3 py-2 border rounded"
      />
      {errors.repeat_password && (
        <p className="text-sm text-red-500">{errors.repeat_password.message}</p>
      )}

      <select {...register("role")} className="w-full px-3 py-2 border rounded">
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      {errors.role && (
        <p className="text-sm text-red-500">{errors.role.message}</p>
      )}

      <select
        {...register("branch_id")}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Select Branch</option>
        {branches?.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name} - {b.location}
          </option>
        ))}
      </select>
      {errors.branch_id && (
        <p className="text-sm text-red-500">{errors.branch_id.message}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        {isLoading ? "Creating..." : "Add User"}
      </button>
    </form>
  );
};

export default AddNewUser;
