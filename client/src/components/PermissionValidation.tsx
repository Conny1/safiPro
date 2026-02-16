import type React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { USER_ROLES } from "../types";

type Props = {
  children: React.ReactNode;
};

const PermissionValidation = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.user.value);

  return (
   user.role === USER_ROLES.SUPER_ADMIN ?children:null
  );
};

export default PermissionValidation;