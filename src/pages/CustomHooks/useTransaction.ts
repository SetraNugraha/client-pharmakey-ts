/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { axiosInstance } from "../../axios/axios";
import { useAuth } from "../../Auth/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IGetTransaction, UpdateIsPaid } from "../../types/transaction.type";

export const useTransaction = ({ customerId, limit }: { customerId?: string; limit?: number }) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);

  // ADMIN
  const { data, isLoading } = useQuery({
    queryKey: ["transaction", page, limit, customerId] as const,
    queryFn: async ({ queryKey }) => {
      const [, page, limit, customerId] = queryKey;

      let url = "/transactions";

      if (customerId) {
        url += "/customer";
      }

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: limit,
        },
      });

      const { transactions, meta } = res.data.data;
      return { transactions, meta } as IGetTransaction;
    },
  });

  const goToPrevPage = () => {
    if (data?.meta?.isPrev) {
      setPage((prevState) => prevState - 1);
    }
  };

  const goToNextPage = () => {
    if (data?.meta?.isNext) {
      setPage((prevState) => prevState + 1);
    }
  };

  // ADMIN
  const updateStatusIsPaid = useMutation({
    mutationKey: ["transaction"],
    mutationFn: async ({ transactionId, newStatus }: { transactionId: string; newStatus: UpdateIsPaid }) => {
      const res = await axiosInstance.put(
        `/transaction/${transactionId}/is-paid/${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });

  // CUSTOMER
  // const { data: customerTransactions, isLoading: customerTransactionsIsLoading } = useQuery({
  //   queryKey: ["transaction"],
  //   queryFn: async () => {
  //     const res = await axiosInstance.get(`/transactions/customer`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const { transactions, meta } = res.data.data;
  //     return { transactions, meta } as IGetTransaction;
  //   },
  // });

  // // CUSTOMER
  // const getCustomerTransactions = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/transactions/customer/mytransactions", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     return {
  //       success: response.data.success,
  //       message: response.data.message,
  //       data: response.data.data,
  //     };
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       return {
  //         success: error.response?.data.success,
  //         message: error.response?.data.message || "An unexpected error occured",
  //       };
  //     } else if (error instanceof Error) {
  //       return {
  //         success: false,
  //         message: error.message,
  //       };
  //     }
  //   }

  // // CUSTOMER
  // const checkout = async (formCheckout: Partial<Transaction>) => {
  //   try {
  //     if (!token) return;

  //     const response = await axiosInstance.post("/api/transactions/checkout", formCheckout, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     return {
  //       success: response.data.success,
  //       message: response.data.message,
  //     };
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       const errorMessage = error.response?.data.errors;
  //       if (errorMessage && Array.isArray(errorMessage) && errorMessage.length > 0) {
  //         setState((prevState) => ({
  //           ...prevState,
  //           hasError: errorMessage[0],
  //         }));
  //       } else {
  //         return {
  //           success: error.response?.data.success,
  //           message: error.response?.data.message || "An unexpected error occured",
  //         };
  //       }
  //     }
  //   }
  // };

  const sendProof = useMutation({
    mutationKey: ["transaction"],
    mutationFn: async ({ transactionId, imageProof }: { transactionId: string; imageProof: File | null }) => {
      const formData = new FormData();

      if (imageProof) {
        formData.append("proof", imageProof);
      }

      const res = await axiosInstance.put(`/transaction/upload-proof/${transactionId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });

  // // CUSTOMER
  // const sendProof = async (transactionId: number | null, proofImage: Partial<Transaction>) => {
  //   try {
  //     if (!token) return;

  //     const formData = new FormData();
  //     const { proof } = proofImage;

  //     if (proof && proof instanceof File) {
  //       formData.append("proof", proof);
  //     }

  //     const response = await axiosInstance.put(`/api/transactions/customer/proof/${transactionId}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     return {
  //       success: response.data.success,
  //       message: response.data.message,
  //     };
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       return {
  //         success: error.response?.data.success,
  //         message: error.response?.data.message || "An unexpected error occured",
  //       };
  //     } else if (error instanceof Error) {
  //       return {
  //         success: false,
  //         message: error.message,
  //       };
  //     }
  //   }
  // };

  return {
    transactions: data?.transactions,
    isLoading: isLoading,
    pagination: data?.meta,
    goToPrevPage,
    goToNextPage,
    updateStatusIsPaid,
    sendProof,
  };
};
