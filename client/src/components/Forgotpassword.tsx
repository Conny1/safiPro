import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type Props = {
  onSwitch: () => void;
};

const schema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Forgotpassword = ({ onSwitch }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    console.log(data);
    // Handle login logic
    // try {
    //   const resp = await login(data);
    //   if (resp.data?.status === 200) {
    //     console.log("logged in");
    //     toast.success("Success..");
    //     dispatch(updateUserData(resp.data.data));
    //     setTimeout(() => {
    //       navigate("/dashboard");
    //     }, 2000);
    //   } else {
    //     toast.error("Invalid password or email.");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Error logingin. Try again.");
    // }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm bg-white p-6 rounded-md shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Enter your email</h2>

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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>

      <p className="text-sm text-center">
        Back to login.
        <button
          type="button"
          onClick={onSwitch}
          className="text-White underline"
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default Forgotpassword;
