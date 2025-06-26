type Props = {
  message: string;
  phone_number: string;
};
const ForwardButtons = ({ message, phone_number }: Props) => {
  const phoneNumber = phone_number.startsWith("254")
    ? phone_number
    : `254${phone_number}`;

  return (
    <div className="flex items-center gap-3  flex-wrap ">
      <a
        href={`sms:+${phoneNumber}?&body=${encodeURIComponent(message)}`}
        className="bg-blue-600 text-white px-4 py-2 rounded block text-center"
      >
        Send SMS Notification
      </a>

      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-4 py-2 rounded block text-center"
      >
        Send WhatsApp Notification
      </a>
    </div>
  );
};

export default ForwardButtons;
