import { useState } from "react";
import { axiosInstance } from "../../axios/axios";
import { useAuth } from "../../Auth/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICreateCategory, IGetCateogry, IUpdateCategory } from "../../types/category.type";
import { objectToFormData } from "../../utils/objectToFormData";

export const useCategory = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const limit = 7;

  const { data, isLoading } = useQuery({
    queryKey: ["category", page, limit],
    queryFn: async ({ queryKey }) => {
      const [, page, limit] = queryKey;
      const res = await axiosInstance.get("/category", {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { categories, meta } = res.data.data;
      return { categories, meta } as IGetCateogry;
    },
  });

  const goToPrevPage = () => {
    if (data?.meta.isPrev) {
      setPage((prevState) => prevState - 1);
    }
  };

  const goToNextPage = () => {
    if (data?.meta.isNext) {
      setPage((prevState) => prevState + 1);
    }
  };

  // CREATE Category
  const createCategory = useMutation({
    mutationKey: ["category", "create"],
    mutationFn: async (payload: Partial<ICreateCategory>) => {
      const { ...categoryFields } = payload;
      const categoryFormData = objectToFormData(categoryFields);

      const res = await axiosInstance.post("/category/create", categoryFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      return {
        success: res.data.success,
        message: res.data.message,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  // UPDATE Category
  const updateCategory = useMutation({
    mutationKey: ["category", "update"],
    mutationFn: async ({ categoryId, payload }: { categoryId?: string; payload: Partial<IUpdateCategory> }) => {
      const { ...categoryFields } = payload;
      const categoryFormData = objectToFormData(categoryFields);

      const res = await axiosInstance.patch(`/category/update/${categoryId}`, categoryFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });

      return {
        success: res.data.success,
        message: res.data.message,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const deleteCategory = useMutation({
    mutationKey: ["category", "delete"],
    mutationFn: async (categoryId: string) => {
      const res = await axiosInstance.delete(`/category/delete/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        success: res.data.success,
        message: res.data.message,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  return {
    categories: data?.categories,
    pagination: data?.meta,
    isLoading: isLoading,
    goToPrevPage,
    goToNextPage,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
