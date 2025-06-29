import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router"; // Using react-router-dom for web
import { updateUserData } from "../redux/userSlice";
import { MenuIcon, XIcon } from "lucide-react"; // Import XIcon for the mobile menu close button

const Nav = () => {
  // State to manage the visibility of the mobile-specific menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation().pathname.match("/confirmation");

  const list = [
    {
      value: "/dashboard",
      label: "Dashboard",
    },
    {
      label: "Orders",
      value: "/order",
    },
    {
      label: "Settings",
      value: "/settings",
    },
    {
      label: "Payments",
      value: "/payment",
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(
      updateUserData({
        first_name: "",
        last_name: "",
        email: "",
        token: "",
        _id: "",
        role: "",
        subscription_data: {},
        branches: [
          {
            branch_id: "",
            role: "",
          },
        ],
      })
    );
    navigate("/auth");
  };

  // Function to toggle the mobile menu's open/close state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className=" border-b w-full flex justify-between items-center mb-5 p-4 relative">
      {/* Brand/Logo Section */}
      <div>
        <p className="text-[25px] font-[600] text-[#535bf2]">SafiPro</p>
      </div>
      {!location && (
        <>
          {/* Mobile Menu Toggle Icon (Hamburger / Close) */}
          {/* This icon is ONLY visible on screens smaller than 'lg' */}
          <div className="lg:hidden z-50">
            {" "}
            {/* z-50 ensures icon is above the mobile menu overlay */}
            {isMobileMenuOpen ? (
              <XIcon
                className="cursor-pointer"
                onClick={toggleMobileMenu}
                size={28}
              />
            ) : (
              <MenuIcon
                className="cursor-pointer"
                onClick={toggleMobileMenu}
                size={28}
              />
            )}
          </div>

          {/* --- Desktop Navigation Menu (Original, Unchanged) --- */}
          {/* This menu is hidden by default and becomes flex ONLY on 'lg' screens and above */}
          <div className="w-[40%] hidden lg:flex justify-evenly items-center">
            {list.map((item) => (
              <div key={item.value}>
                <Link to={item.value}>{item.label}</Link>
              </div>
            ))}
            <button onClick={logout}>Logout</button>
          </div>

          {/* --- Mobile-Specific Navigation Menu (New) --- */}
          {/*
        This menu is ONLY visible on screens smaller than 'lg'.
        It will slide in from the right when toggled open.
      */}
          <div
            className={`
          // Control visibility based on state for mobile, and hide on large screens
          ${isMobileMenuOpen ? "flex" : "hidden"}
          lg:hidden

          // Mobile-specific layout and positioning (full screen overlay)
          flex-col // Stack items vertically
          fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm // Full height, fixed to right, limited width
          bg-white shadow-lg p-6 space-y-6 z-40 // Styling: background, shadow, padding, vertical spacing, z-index

          // Slide-in/out animation for mobile
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } // Slide in/out effect
        `}
          >
            {/* Close button inside the mobile menu (for better mobile UX) */}
            <div className="flex justify-end mb-6">
              <XIcon
                className="cursor-pointer"
                onClick={toggleMobileMenu}
                size={28}
              />
            </div>

            {list.map((item) => (
              <div key={item.value}>
                <Link
                  to={item.value}
                  className="text-lg text-gray-800 hover:text-[#535bf2] block py-2" // Added block and py-2 for better touch targets on mobile
                  onClick={toggleMobileMenu} // Close mobile menu when a link is clicked
                >
                  {item.label}
                </Link>
              </div>
            ))}
            <button
              onClick={() => {
                logout();
                toggleMobileMenu();
              }} // Close mobile menu on logout, then logout
              className="bg-[#535bf2] text-white py-2 px-4 rounded-md hover:bg-[#434bcf] mt-4"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {/* Visible only when the mobile menu is open and on screens smaller than 'lg' */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={toggleMobileMenu} // Clicking overlay closes the menu
            ></div>
          )}
        </>
      )}
    </div>
  );
};

export default Nav;
