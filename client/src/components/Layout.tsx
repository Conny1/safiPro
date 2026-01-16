import { Outlet, useLocation, useNavigate } from "react-router";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import { persistor, type RootState } from "../redux/store";
import { useEffect } from "react";
import { useGetauthuserQuery } from "../redux/apislice";
import { logout, updateUserData } from "../redux/userSlice";
import { USER_ROLES } from "../types";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.value);
  const location = useLocation();

  // Only run the query if user has a token
  const { data } = useGetauthuserQuery(undefined, {
    skip: !user.token,
  });
  // service  worker EVENT registration
  useEffect(() => {
    // e.g., when saving an order offline
    async function registerSync() {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        try {
          await registration.sync.register("persist-to-database");
          console.log("Background sync registered");
        } catch (err) {
          console.error("Failed to register background sync:", err);
        }
      }
    }
    registerSync()
  }, []);

  useEffect(() => {
    if (data && "data" in data && user.token) {
      dispatch(updateUserData({ ...data.data, token: user.token }));
    }
  }, [data, dispatch, user.token]);

  useEffect(() => {
    if (!user.token) {
      navigate("/auth");
    }
    if (
      user.role === USER_ROLES.SUPER_ADMIN &&
      user.subscription.status === "inactive" &&
      location.pathname !== "/confirmation"
    ) {
      navigate("/payment");
    }
    if (
      user.role === USER_ROLES.STAFF &&
      user.subscription.status === "inactive" &&
      location.pathname !== "/confirmation"
    ) {
      navigate("/subscriptionRequired");
    }
  }, [
    user.token,
    location.pathname,
    navigate,
    user.role,
    user.subscription.status,
  ]);

  const logOut = () => {
    dispatch(logout());
    persistor.purge();
    setTimeout(() => {
      navigate("/auth");
    }, 1500);
  };

  if (location.pathname === "/confirmation") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      {user.subscription.status === "active" ? (
        <Nav />
      ) : (
        <div className="p-4">
          <button
            onClick={logOut}
            className="px-4 py-2 text-red-600 rounded-lg hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`
        transition-all duration-300 ease-in-out
        lg:pl-64 /* Full sidebar width */
      `}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
