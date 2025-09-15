import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../Auth/useAuth";
import { axiosInstance } from "../../axios/axios";
import { IGetDashboard } from "../../types/dashboard.type";

export const useAdmin = () => {
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dsahboard"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data as IGetDashboard;
    },
  });

  return {
    data,
    isLoading,
  };
};
