import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import type { login } from "../types";
import { useLoginMutation } from "../redux/apislice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUserData } from "../redux/userSlice";

type Props = {
  onSwitch: () => void;
  setforgotpassword: React.Dispatch<React.SetStateAction<boolean>>;
};

const schema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const Login = ({ onSwitch, setforgotpassword }: Props) => {
  const [login, { isLoading: loginloading }] = useLoginMutation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<login>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: login) => {
    // Handle login logic
    try {
      const resp = await login(data);
      if (resp.data?.status === 200) {
        console.log("logged in");
        toast.success("Success..");

        setTimeout(() => {
          if (resp.data) {
            dispatch(updateUserData(resp.data.data));
          }
        }, 1000);
      } else {
        toast.error("Invalid password or email.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error logingin. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm p-6 space-y-4 bg-white rounded-md shadow-md"
    >
      <h2 className="text-xl font-semibold">Login</h2>

      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loginloading}
        className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        {loginloading ? "Loading..." : "Login"}
      </button>

      <p className="text-sm text-center">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-bold text-blue-600 underline"
        >
          Sign up
        </button>
      </p>
      <p
        onClick={() => setforgotpassword(true)}
        className="text-sm text-center text-blue-600 underline cursor-pointer "
      >
        Forgot password ?
      </p>
    </form>
  );
};

export default Login;
