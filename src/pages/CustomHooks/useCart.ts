/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "../../Auth/useAuth";
import { axiosInstance } from "../../axios/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartActionMethod, IGetCartDto } from "../../types/cart.type";
import { ICheckout } from "../../types/transaction.type";

export const useCart = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/cart/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data as IGetCartDto;
    },
  });

  const cartAction = useMutation({
    mutationKey: ["cart"],
    mutationFn: async ({ action, productId }: { action: CartActionMethod; productId: string }) => {
      let endpoint =
        action === CartActionMethod.ADD
          ? `/cart/${CartActionMethod.ADD}/product/${productId}`
          : `/cart/${CartActionMethod.REMOVE}/product/${productId}`;

      const res = await axiosInstance.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // CUSTOMER Checkout
  const checkout = useMutation({
    mutationKey: ["transaction", "checkout"],
    mutationFn: async (payload: ICheckout) => {
      const res = await axiosInstance.post("/transaction/checkout", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = res.data;
      return { success, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction", "cart"] });
    },
  });

  // const cartAction = async (productId: number, action: "add" | "delete") => {
  //   try {
  //     if (!token) return;

  //     if (!["add", "remove"].includes(action)) {
  //       console.error("Invalid action, allowed action are 'add' or 'remove'");
  //     }

  //     const method = action === "add" ? "POST" : "DELETE";
  //     const endpoint = action === "add" ? `/api/carts/add/${productId}` : `/api/carts/delete/${productId}`;

  //     const response = await axiosInstance({
  //       method,
  //       url: endpoint,
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
  //         message: error.response?.data.message,
  //       };
  //     }

  //     return {
  //       success: false,
  //       message: "An unexpected error occured",
  //     };
  //   }
  // };

  return {
    customerCarts: data,
    isLoading,
    cartAction,
    checkout
  };
};
