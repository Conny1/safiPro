import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import type { RootState } from "../redux/store";
import laundryImage from "/laundry-illustration.jpg";
import {
  CheckCircle,
  BarChart3,
  CreditCard,
  Building,
  Bell,
} from "lucide-react"; // Install lucide-react for icons

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
        handleBeforeInstallPrompt,
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

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Order Tracking",
      desc: "Track laundry from drop-off to pickup with status updates and photo documentation.",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Expense Management",
      desc: "Monitor operational costs including detergents, rent, salaries, and utilities.",
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Branch Management",
      desc: "Seamlessly manage multiple outlets and staff roles from a centralized dashboard.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Automated Notifications",
      desc: "Send SMS/WhatsApp updates to customers at each stage of the laundry process.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-Time Analytics",
      desc: "Gain insights into daily revenue, order volumes, and business performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SafiPro</span>
            </div>

            <div className="flex items-center space-x-4 ">
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:text-blue-800"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="overflow-hidden bg-white">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="max-w-2xl">
              <div className="inline-flex px-3 py-1 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                Built for Kenyan Businesses
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Streamline Your
                <span className="block text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text">
                  Laundry Operations
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                SafiPro provides an all-in-one solution for laundry businesses
                to manage orders, track expenses, coordinate staff, and delight
                customers—all from a single, intuitive dashboard.
              </p>

              <div className="flex flex-col gap-4 mt-10 sm:flex-row sm:items-center">
                {showInstallBtn ? (
                  <button
                    onClick={handleInstallClick}
                    className="px-8 py-3 text-base font-medium text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                  >
                    Install Mobile App
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className="px-8 py-3 text-base font-medium text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                  >
                    Start 30-Day Free Trial
                  </button>
                )}
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-green-600">
                    No credit card required
                  </span>
                  <span className="mx-2">•</span>
                  <span>Cancel anytime</span>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm font-medium text-gray-500">
                  TRUSTED BY BUSINESSES ACROSS KENYA
                </p>
                <div className="flex flex-wrap gap-8 mt-4">
                  {["Nairobi", "Mombasa", "Kisumu", "Nakuru"].map((city) => (
                    <div key={city} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span className="font-medium text-gray-700">{city}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden shadow-2xl rounded-2xl">
                <img
                  src={laundryImage}
                  alt="Laundry management dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
              </div>
              <div className="absolute w-32 h-32 rounded-full -bottom-6 -left-6 bg-gradient-to-r from-blue-100 to-blue-200 -z-10" />
              <div className="absolute w-24 h-24 rounded-full -top-6 -right-6 bg-gradient-to-r from-blue-50 to-blue-100 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Scale
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
              Comprehensive tools designed specifically for laundry business
              growth
            </p>
          </div>

          <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-8 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-6 text-blue-600 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-relaxed text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Transparent Pricing
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
              One simple plan with everything you need to grow
            </p>
          </div>

          <div className="mt-16">
            <div className="relative max-w-md mx-auto overflow-hidden bg-white shadow-xl rounded-2xl">
              <div className="absolute top-0 right-0 px-4 py-1 text-sm font-medium text-white rounded-bl-lg bg-gradient-to-r from-blue-600 to-blue-700">
                Most Popular
              </div>

              <div className="p-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    KES 900
                  </span>
                  <span className="ml-2 text-lg text-gray-600">/month</span>
                </div>

                <div className="p-4 mt-4 rounded-lg bg-green-50">
                  <p className="font-medium text-green-700">
                    ✓ 30-day free trial included
                  </p>
                </div>

                <ul className="mt-8 space-y-4">
                  {[
                    "Unlimited orders",
                    "Up to 5 branch locations",
                    "Staff role management",
                    "Expense tracking & reporting",
                    "Customer SMS notifications",
                    "Priority email support",
                    "Free updates & security patches",
                    "Realtime analytics of your business",
                    "Record orders when offline",
                  ].map((item) => (
                    <li key={item} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-4 mt-10 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                >
                  Start Free Trial
                </button>

                <p className="mt-4 text-sm text-center text-gray-500">
                  No setup fees • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              See It in Action
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
              Watch how SafiPro transforms laundry management
            </p>
          </div>

          <div className="mt-12 overflow-hidden shadow-2xl rounded-2xl">
            <div className="relative aspect-video bg-gradient-to-r from-blue-900 to-slate-900">
              <video
                controls
                className="w-full h-full"
                poster="/video-poster.jpg"
              >
                <source src="/demo.webm" type="video/webm" />
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join hundreds of laundry businesses already using SafiPro to save
            time and grow revenue.
          </p>

          <div className="flex flex-col gap-4 mt-10 sm:flex-row sm:justify-center">
            {showInstallBtn ? (
              <button
                onClick={handleInstallClick}
                className="px-8 py-3 text-base font-medium text-blue-500 transition-all bg-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
              >
                Install Mobile App
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-3 text-base font-medium text-blue-600 transition-colors bg-white rounded-lg shadow-lg hover:bg-gray-50"
              >
                Start Free Trial
              </button>
            )}
          </div>

          <p className="mt-6 text-sm text-blue-200">
            Get started in minutes • No technical skills required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-white">SafiPro</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="transition-colors hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Contact
              </a>
            </div>

            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} SafiPro. All rights reserved.
            </div>
          </div>

          <div className="pt-6 mt-6 text-xs text-center text-gray-500 border-t border-gray-800">
            Built with ❤️ for laundry businesses across Kenya
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
