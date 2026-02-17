type Props = {
  message: string;
  phone_number: string;
};
const ForwardButtons = ({ message, phone_number }: Props) => {
  const type = phone_number.startsWith("254") || phone_number.startsWith("+254");
  const phoneNumber = type ? phone_number : `254${phone_number}`;

  return (
    <div className="flex flex-wrap items-center gap-3 ">
      <a
        href={`sms:+${phoneNumber}?&body=${encodeURIComponent(message)}`}
        className="block px-4 py-2 text-center text-white bg-blue-600 rounded"
      >
        Send SMS Notification
      </a>

      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-4 py-2 text-center text-white bg-green-600 rounded"
      >
        Send WhatsApp Notification
      </a>
    </div>
  );
};

export default ForwardButtons;
