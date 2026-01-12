import  { useEffect, useState } from "react";
import { useDispatch, } from "react-redux";
import { setOnline } from "../redux/networkSlice";

const useNetworkStatus = () => {
  const dispatch = useDispatch();
//   const isOnline = useSelector((state: RootState) => state.network.isOnline);  
  const [isOnline,] = useState( navigator.onLine )

  useEffect(() => {
    console.log(isOnline)
    // subscribe to event when components mount
    window.addEventListener("online", () => {
      setOnline(true)
      dispatch(setOnline(true))});
    window.addEventListener("offline", () => {
      setOnline(false)
      dispatch(setOnline(false))});

    //  clean up when component unmounts
    return () => {
      window.removeEventListener("online", () =>  {
      setOnline(true)
      dispatch(setOnline(true))});
      window.removeEventListener("offline", () => {
      setOnline(false)
      dispatch(setOnline(false))});
    };
  }, [dispatch, isOnline]);

  return {isOnline};
};

export default useNetworkStatus;
