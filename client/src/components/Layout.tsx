import { Outlet, useLocation, useNavigate } from "react-router";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useEffect } from "react";
import { useGetauthuserQuery } from "../redux/apislice";
import { updateUserData } from "../redux/userSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.value);
  const location = useLocation().pathname.match("/confirmation");
  // Only run the query if user has a token
  const { data } = useGetauthuserQuery(undefined, {
    skip: !user.token,
  });

  useEffect(() => {
    console.log(user);

    if (!user.token) {
      navigate("/auth");
    }
    if (user.subscription.status !== "active" && !location) {
      navigate("/payment");
    }
  }, [user.token, navigate, location]);

  useEffect(() => {
    if (data && "data" in data && user.token) {
      dispatch(updateUserData({ ...data.data, token: user.token }));
    }
  }, [data, dispatch, user.token]);

  return (
    <div className="min-h-screen">
      {user.subscription.status === "active" && <Nav />}
      <Outlet />
    </div>
  );
};

export default Layout;
