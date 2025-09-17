/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "../../Auth/useAuth";
import { axiosInstance } from "../../axios/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartActionMethod, IGetCartDto } from "../../types/cart.type";
import { ICheckout } from "../../types/transaction.type";
import { useNavigate } from "react-router-dom";
import { CustomAlert } from "../../utils/CustomAlert";

export const useCart = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    mutationFn: async ({ action, productId, quantity = 1 }: { action: CartActionMethod; productId: string; quantity: number }) => {
      // Check Authentication
      if (!token) {
        CustomAlert("Authentication", "warning", "Login required. Please sign in to continue.");
        navigate("/login");
      }

      let endpoint =
        action === CartActionMethod.ADD
          ? `/cart/${CartActionMethod.ADD}/product/${productId}`
          : `/cart/${CartActionMethod.REMOVE}/product/${productId}`;

      const res = await axiosInstance.post(
        endpoint,
        { quantity },
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

  return {
    customerCarts: data,
    isLoading,
    cartAction,
    checkout,
  };
};
