/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useAuth } from "../../Auth/useAuth"
import { axiosInstance } from "../../axios/axios"
import { Cart } from "../../types"
import { AxiosError } from "axios"

export const useCart = () => {
  const { token } = useAuth()
  const [customerCarts, setCustomerCarts] = useState<Cart[]>([])

  const getCustomerCart = async () => {
    try {
      const response = await axiosInstance.get("/api/carts/mycart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCustomerCarts(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: error.response?.data.success,
          message: error.response?.data.message,
        }
      } else {
        return {
          success: false,
          message: "An unexpected error occured",
        }
      }
    }
  }

  useEffect(() => {
    getCustomerCart()
  }, [])

  const cartAction = async (productId: number, action: "add" | "delete") => {
    try {
      if (!token) return

      if (!["add", "delete"].includes(action)) {
        console.error("Invalid action, allowed action are 'add' or 'delete'")
      }

      const method = action === "add" ? "POST" : "DELETE"
      const endpoint = action === "add" ? `/api/carts/add/${productId}` : `/api/carts/delete/${productId}`

      const response = await axiosInstance({
        method,
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return {
        success: response.data.success,
        message: response.data.message,
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: error.response?.data.success,
          message: error.response?.data.message,
        }
      }

      return {
        success: false,
        message: "An unexpected error occured",
      }
    }
  }

  return {
    getCustomerCart,
    cartAction,
    customerCarts,
  }
}
