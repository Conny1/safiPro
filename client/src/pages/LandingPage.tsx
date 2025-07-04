import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import type { RootState } from "../redux/store";
import laundryImage from "/laundry-illustration.jpg"; // replace with your own image

const LandingPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const path = useLocation().pathname.match("/");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (user.token && path) {
      navigate("/dashboard");
    }
  }, [path, user.token, navigate]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-blue-800">SafiPro</h1>
        <div className="space-x-3">
          <button
            onClick={() => navigate("/auth")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row-reverse items-center gap-8 max-w-7xl w-full px-6 my-10 mx-auto">
        <div className="md:w-1/2 text-center md:text-left space-y-5">
          <h2 className="text-4xl font-bold text-blue-800 leading-tight">
            Run your laundry business with ease
          </h2>
          <p className="text-gray-600 text-lg">
            Track orders, manage your staff, and simplify day-to-day operations.
            SafiPro is built for small laundry shop owners who want to stay in
            control — without the tech headaches.
          </p>
          {showInstallBtn ? (
            <button
              onClick={handleInstallClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg"
            >
              Download App
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Install option will appear on supported devices.
            </p>
          )}
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={laundryImage}
            alt="Laundry illustration"
            className="w-full max-w-md object-contain rounded-lg"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white w-full py-10 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-blue-800">Features</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="text-xl font-semibold text-blue-700">
                Track Orders
              </h4>
              <p className="text-gray-600 mt-2">
                View and update laundry orders as they move through your
                workflow.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="text-xl font-semibold text-blue-700">
                Manage Staff
              </h4>
              <p className="text-gray-600 mt-2">
                Assign roles and monitor performance across branches.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="text-xl font-semibold text-blue-700">
                SMS/WhatsApp Alerts
              </h4>
              <p className="text-gray-600 mt-2">
                Send customers reminders when their laundry is ready — manually
                for now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-blue-100 w-full py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-3xl font-bold text-blue-800">Simple Pricing</h3>
          <p className="text-gray-600">
            Start with our basic plan. Upgrade anytime as your business grows.
          </p>
          <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto space-y-4">
            <p className="text-2xl font-semibold text-blue-800">
              KES 1000 / Month
            </p>
            <p className="text-green-600 font-medium">
              Start with a <strong>1 month free trial</strong>
            </p>

            <ul className="text-gray-600 list-disc list-inside text-left space-y-2">
              <li>Track unlimited laundry orders</li>
              <li>Add upto 5 branches</li>
              <li>Manage staff per branch</li>
              <li>Send manual SMS/WhatsApp updates</li>
              <li>Free feature updates</li>
            </ul>
            <button
              onClick={() => navigate("/auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="bg-white w-full py-12 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-blue-800">See It in Action</h3>
          <p className="text-gray-600 text-lg">
            Watch how SafiPro can simplify your laundry business.
          </p>
          <video
            controls
            className="w-full max-w-3xl rounded-lg shadow-md mx-auto"
          >
            <source src="/demo.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-6">
        © {new Date().getFullYear()} SafiPro. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
