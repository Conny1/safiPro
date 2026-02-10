import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useCreateAccountMutation } from "../redux/apislice";
import type { createAccount } from "../types";
import { toast } from "react-toastify";

type Props = {
  onSwitch: () => void;
};

const schema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  repeat_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const Signup = ({ onSwitch }: Props) => {
  const [createAccount, { isLoading }] = useCreateAccountMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createAccount>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: createAccount) => {
    try {
      const resp = await createAccount({ ...data, role: "Super Admin" });
      console.log("Signup response:", resp);
      if (resp.data?.status === 200) {
        toast.success("Success..Log in to proceed.");
        setTimeout(() => {
          onSwitch();
        }, 4000);
      }else{
        if( resp.error && "status" in resp.error &&  resp.error?.status === 400){
        toast.error("Account with that email exists")

        }
      }
    } catch (error) {
  
      console.error("Signup failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm p-6 space-y-4 bg-white rounded-md shadow-md"
    >
      <h2 className="text-xl font-semibold">Sign Up</h2>

      <div>
        <input
          type="text"
          placeholder="First Name"
          {...register("first_name")}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.first_name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.first_name.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Last Name"
          {...register("last_name")}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.last_name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.last_name.message}
          </p>
        )}
      </div>

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

      <div>
        <input
          type="password"
          placeholder="Repeat Password"
          {...register("repeat_password")}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.repeat_password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.repeat_password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        {isLoading ? "Loading..." : "Sign Up"}
      </button>

      <p className="text-sm text-center">
        Already have an account?
        <button onClick={onSwitch} className="font-bold text-blue-600 underline">
          Login
        </button>
      </p>
    </form>
  );
};

export default Signup;
