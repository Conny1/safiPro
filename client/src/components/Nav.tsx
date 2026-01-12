import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { 
  MenuIcon, 
  XIcon, 
  LayoutDashboard,
  Package,
  Settings,
  CreditCard,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logout } from "../redux/userSlice";
import { persistor } from "../redux/store";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation()
  const user = useSelector((state: RootState) => state.user.value);

  const navItems = [
    {
      value: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      value: "/order",
      label: "Orders",
      icon: Package,
    },
    {
      value: "/payment",
      label: "Payments",
      icon: CreditCard,
    },
    {
      value: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logout());
    persistor.purge();
    setTimeout(() => {
      navigate("/auth");
    }, 1500);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };



  return (
    <>
      {/* Mobile Menu Toggle (Hamburger) - Only visible on mobile */}
      <div className="fixed z-50 lg:hidden top-4 left-4">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {isMobileMenuOpen ? (
            <XIcon className="w-6 h-6 "  color="black" />
          ) : (
            <MenuIcon className="w-6 h-6 " color="black" />
          )}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <div className={`
        hidden lg:flex flex-col h-screen bg-white border-r border-gray-200
        fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">SafiPro</h1>
                <p className="text-xs text-gray-500">Laundry Management</p>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className={`p-6 border-b border-gray-200 ${isSidebarCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{user.first_name || "User"}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {user.role === "super_admin" ? "Super Admin" : "Branch Manager"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.value 
            
            return (
              <Link
                key={item.value}
                to={item.value}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  ${isSidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                {!isSidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 space-y-2 border-t border-gray-200">
          {/* Notifications */}
          {/* <button className={`
            flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full
            ${isSidebarCollapsed ? 'justify-center' : ''}
          `}>
            <Bell className="w-5 h-5 text-gray-500" />
            {!isSidebarCollapsed && (
              <span className="font-medium">Notifications</span>
            )}
            {!isSidebarCollapsed && (
              <span className="flex items-center justify-center w-5 h-5 ml-auto text-xs text-white bg-red-500 rounded-full">
                3
              </span>
            )}
          </button> */}

          {/* Help & Support */}
          {/* <button className={`
            flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full
            ${isSidebarCollapsed ? 'justify-center' : ''}
          `}>
            <HelpCircle className="w-5 h-5 text-gray-500" />
            {!isSidebarCollapsed && <span className="font-medium">Help</span>}
          </button> */}

          {/* Logout Button */}
          <button
            onClick={logOut}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full
              ${isSidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>

          {/* Collapse Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Sidebar */}
          <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-xl">
            {/* Mobile Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800">
                    <span className="text-lg font-bold text-white">S</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">SafiPro</h1>
                    <p className="text-xs text-gray-500">Laundry Management</p>
                  </div>
                </div>
                <button onClick={toggleMobileMenu}>
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{user.first_name || "User"}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role === "super_admin" ? "Super Admin" : "Branch Manager"}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.value;
                
                return (
                  <Link
                    key={item.value}
                    to={item.value}
                    onClick={toggleMobileMenu}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 border-t border-gray-200">
              {/* <button className="flex items-center w-full gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Notifications</span>
                <span className="flex items-center justify-center w-5 h-5 ml-auto text-xs text-white bg-red-500 rounded-full">
                  3
                </span>
              </button> */}

              {/* <button className="flex items-center w-full gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50">
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Help & Support</span>
              </button> */}

              <button
                onClick={() => {
                  toggleMobileMenu();
                  logOut();
                }}
                className="flex items-center w-full gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;