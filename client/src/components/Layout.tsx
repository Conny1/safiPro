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
  }, [user.token, location.pathname, navigate]);
  const logOut = () => {
    dispatch(logout());
    persistor.purge();
    setTimeout(() => {
      navigate("/auth");
    }, 1500);
  };
  return (
    <div className="min-h-screen">
      {user.subscription.status === "active" ? (
        <Nav />
      ) : (
        <button onClick={logOut}>Log out</button>
      )}
      <Outlet />
    </div>
  );
};

export default Layout;
