import React, { useEffect, useState } from "react";

const LandingPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-blue-800">SafiPro</h1>
        <p className="text-gray-600 text-lg">
          The smartest way to manage your laundry business — track orders,
          manage staff, and stay in control from anywhere.
        </p>

        {showInstallBtn && (
          <button
            onClick={handleInstallClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            Download App
          </button>
        )}

        {!showInstallBtn && (
          <p className="text-sm text-gray-500">
            Install option will appear if supported on this device.
          </p>
        )}
      </div>

      <footer className="absolute bottom-4 text-sm text-gray-400">
        © {new Date().getFullYear()} SafiPro
      </footer>
    </div>
  );
};

export default LandingPage;
