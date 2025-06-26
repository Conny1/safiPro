import React from "react";
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
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm bg-white p-6 rounded-md shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Sign Up</h2>

      <div>
        <input
          type="text"
          placeholder="First Name"
          {...register("first_name")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.first_name.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Last Name"
          {...register("last_name")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.last_name.message}
          </p>
        )}
      </div>

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

      <div>
        <input
          type="password"
          placeholder="Repeat Password"
          {...register("repeat_password")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.repeat_password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.repeat_password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isLoading ? "Loading..." : "Sign Up"}
      </button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-white underline">
          Login
        </button>
      </p>
    </form>
  );
};

export default Signup;
