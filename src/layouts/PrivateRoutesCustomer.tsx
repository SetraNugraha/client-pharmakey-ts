/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Auth/useAuth";
import { CustomAlert } from "../utils/CustomAlert";

export const PrivateRoutesCustomer = () => {
  const { token, user, refreshToken } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = async () => {
      await refreshToken();
      setIsLoading(false);
    };

    checkToken();
  }, []);

  if (isLoading) {
    return <div className="text-center font-bold mt-5 text-xl tracking-wider text-slate-500">Loading ....</div>;
  }

  if (!token || !user || user.role !== "CUSTOMER") {
    CustomAlert("Authentication Failed", "warning", "Login required.");
    return <Navigate to={"/login"} replace />;
  }

  return token && user && user.role === "CUSTOMER" ? <Outlet /> : null;
};
