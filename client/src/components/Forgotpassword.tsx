import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSendResetLinkEmailMutation } from "../redux/apislice";
import { toast } from "react-toastify";

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
  const [sendResetLinkEmail, { isLoading: sendLoading }] =
    useSendResetLinkEmailMutation();
  const onSubmit = async (data: { email: string }) => {
    try {
      const resp = await sendResetLinkEmail(data);
      if (resp.data?.status === 200) {
        toast.success(
          "Success..Reset password link has been sent to your email."
        );
      } else {
        toast.error("Not send. Try again");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error ... Try again.");
    }
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
        disabled={sendLoading}
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {sendLoading ? "Loading..." : "Submit"}
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
