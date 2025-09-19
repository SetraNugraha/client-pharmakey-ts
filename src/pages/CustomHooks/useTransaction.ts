/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axios";
import { useAuth } from "../../Auth/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IGetTransaction, IsPaid, UpdateIsPaid } from "../../types/transaction.type";

interface Props {
  limit?: number;
  customerId?: string;
  status?: IsPaid;
  proofUpload?: boolean;
}

export const useTransaction = ({ customerId, limit, status, proofUpload }: Props) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);

  // Reset page if user filtered data transactions
  useEffect(() => {
    setPage(1);
  }, [status, proofUpload]);

  // ADMIN & CUSTOMER
  const { data, isLoading } = useQuery({
    queryKey: ["transaction", page, limit, customerId, status, proofUpload] as const,
    queryFn: async ({ queryKey }) => {
      const [, page, limit, customerId, status, proofUpload] = queryKey;

      // Endpoint Transctions
      let url = "/transactions";

      // Endpoint for transaction customer
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
          status,
          proofUpload,
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
