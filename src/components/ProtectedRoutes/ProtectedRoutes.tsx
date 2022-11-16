import * as React from "react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
interface Props {
  children: ReactNode;
}
export const ProtectedRoutes= ({ children }:Props) => {
    const user = UserAuth()?.user;
    if (user === null || user === undefined)
        return <Navigate to="/" replace={true} />
    return <>{children}</>;
}