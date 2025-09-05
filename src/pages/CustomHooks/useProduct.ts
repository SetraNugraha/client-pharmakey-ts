import { useState } from "react";
import { axiosInstance } from "../../axios/axios";
import { useAuth } from "../../Auth/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICreateProduct, IGetProduct, ProductBySlug } from "../../types/product.type";
import { Product } from "../../types/product.type";
import { objectToFormData } from "../../utils/objectToFormData";

export const useProducts = ({ limit, slug }: { limit?: number; slug?: string }) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useQuery({
    queryKey: ["product", page, limit],
    queryFn: async ({ queryKey }) => {
      const [, page, limit] = queryKey;
      const res = await axiosInstance.get("/products", {
        params: {
          page: page,
          limit: limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { products, meta } = res.data.data;

      return { products, meta } as IGetProduct;
    },
  });

  const { data: productBySlug, isLoading: isLoadingProductBySlug } = useQuery({
    queryKey: ["product", slug],
    queryFn: async ({ queryKey }) => {
      const [, slug] = queryKey;
      const res = await axiosInstance.get(`/product/${slug}`);

      return res.data.data as ProductBySlug;
    },
    enabled: !!slug,
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

  // CREATE Product
  const createProduct = useMutation({
    mutationKey: ["product", "create"],
    mutationFn: async (payload: ICreateProduct) => {
      const { ...productFields } = payload;
      const productFormData = objectToFormData(productFields);

      const res = await axiosInstance.post("/product/create", productFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  // UPDATE Product
  const updateProduct = useMutation({
    mutationKey: ["product", "update"],
    mutationFn: async ({ productId, payload }: { productId: string; payload: Partial<Product> }) => {
      const { ...productFields } = payload;
      const productFormData = objectToFormData(productFields);

      const res = await axiosInstance.patch(`/product/update/${productId}`, productFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  // DELETE Product
  const deleteProduct = useMutation({
    mutationKey: ["product", "delete"],
    mutationFn: async (productId: string) => {
      const res = await axiosInstance.delete(`/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  return {
    products: data?.products,
    isLoading,
    pagination: data?.meta,
    goToPrevPage,
    goToNextPage,
    productBySlug,
    isLoadingProductBySlug,
    // getProductById,
    // searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
