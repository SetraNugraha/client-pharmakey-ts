import { useState } from "react";
import { axiosInstance } from "../../axios/axios";
import { useAuth } from "../../Auth/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IRegisterCustomer } from "../../types/auth.type";
import { Customer, IGetCustomerDto, IUpdateCustomer } from "../../types/customer.type";
import { objectToFormData } from "../../utils/objectToFormData";

export const useCustomer = (customerId?: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const limit = 5;

  // ADMIN
  const { data, isLoading } = useQuery({
    queryKey: ["customer", page, limit],
    queryFn: async ({ queryKey }) => {
      const [, page, limit] = queryKey;

      const res = await axiosInstance.get("/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      });

      return res.data.data as IGetCustomerDto;
    },
  });

  // CUSTOMER
  const { data: authCustomer, isLoading: isLoadingAuthCustomer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async ({ queryKey }) => {
      const [, customerId] = queryKey;
      const res = await axiosInstance.get(`/customer/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data as Customer;
    },
    enabled: !!customerId,
  });

  // // ADMIN
  const goToPrevPage = () => {
    if (data?.meta.isPrev) {
      setPage((prevState) => prevState - 1);
    }
  };

  // // ADMIN
  const goToNextPage = () => {
    if (data?.meta.isNext) {
      setPage((prevState) => prevState + 1);
    }
  };

  const registerCustomer = useMutation({
    mutationKey: ["customer", "create"],
    mutationFn: async (payload: IRegisterCustomer) => {
      const res = await axiosInstance.post("/auth/register", payload);
      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });

  // ADMIN
  const deleteCustomer = useMutation({
    mutationKey: ["customer", "delete"],
    mutationFn: async (customerId: string) => {
      const res = await axiosInstance.delete(`/customer/delete/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });

  // CUSTOMER
  const updateCustomer = useMutation({
    mutationKey: ["customer"],
    mutationFn: async (payload: IUpdateCustomer) => {
      const { ...fieldCustomer } = payload;
      const formDataCustomer = objectToFormData(fieldCustomer);

      const res = await axiosInstance.patch("/customer/update", formDataCustomer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });

  return {
    customers: data?.customers,
    pagination: data?.meta,
    isLoading,
    authCustomer,
    isLoadingAuthCustomer,
    goToNextPage,
    goToPrevPage,
    registerCustomer,
    updateCustomer,
    deleteCustomer,
    // getAllCustomer,
    // getCustomerById,
  };
};
