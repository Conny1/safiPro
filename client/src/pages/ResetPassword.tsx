import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useResetPasswordMutation } from "../redux/apislice"; // adjust if needed
import { useNavigate, useParams } from "react-router";

type ResetForm = {
  password: string;
  confirmPassword: string;
};

const schema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: yupResolver(schema),
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { token } = useParams(); // e.g., /reset-password/:token
  const navigate = useNavigate();
  const onSubmit = async (data: ResetForm) => {
    try {
      const resp = await resetPassword({
        token: token as string,
        password: data.password,
      });

      if (resp.data?.status === 200) {
        toast.success("Password reset successfully! Redirecting to Login.");
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } else {
        toast.error("Failed to reset password. Try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm p-6 space-y-4 bg-white rounded-md shadow-md"
      >
        <h2 className="text-xl font-semibold">Reset Your Password</h2>

        <div>
          <input
            type="password"
            placeholder="New Password"
            {...register("password")}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
