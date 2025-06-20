import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import type { login } from "../types";
import { useLoginMutation } from "../redux/apislice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { updateUserData } from "../redux/userSlice";

type Props = {
  onSwitch: () => void;
};

const schema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const Login = ({ onSwitch }: Props) => {
  const [login, { isLoading: loginloading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<login>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: login) => {
    console.log("Logging in:", data);
    // Handle login logic
    try {
      const resp = await login(data);
      if (resp.data?.status === 200) {
        console.log("logged in");
        toast.success("Success..");
        dispatch(updateUserData(resp.data.data));
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else {
        toast.error("Invalid password or email.");
      }
    } catch (error) {
      toast.error("Error logingin. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm bg-white p-6 rounded-md shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Login</h2>

      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loginloading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loginloading ? "Loading..." : "Login"}
      </button>

      <p className="text-sm text-center">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-600 underline"
        >
          Sign up
        </button>
      </p>
    </form>
  );
};

export default Login;
