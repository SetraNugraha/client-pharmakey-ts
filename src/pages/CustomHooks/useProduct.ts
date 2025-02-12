import { useState } from "react"
import { axiosInstance } from "../../axios/axios"
import { AxiosError } from "axios"
import { useAuth } from "../../Auth/useAuth"
import { Product, Errors } from "../../types"

type Pagination = {
  currPage: number
  limit: number
  totalPages: number
  totalProducts: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

type ProductState = {
  data: Product[]
  isLoading: boolean
  hasError: Errors | null
  pagination: Pagination
}

export const useProducts = () => {
  const { token } = useAuth()
  const [state, setState] = useState<ProductState>({
    data: [],
    isLoading: false,
    hasError: null,
    pagination: {
      currPage: 1,
      limit: 0,
      totalPages: 0,
      totalProducts: 0,
      hasPrevPage: false,
      hasNextPage: false,
    },
  })

  // GET
  const getAllProducts = async (page: number = 1, limit: number = 5) => {
    setState((prevState) => ({ ...prevState, isLoading: true }))
    try {
      const response = await axiosInstance.get("/api/products", {
        params: {
          page: page,
          limit: limit,
        },
      })

      setState((prevState) => ({
        ...prevState,
        data: response.data.data,
        hasError: null,
        pagination: {
          currPage: response.data.meta.currPage,
          limit: response.data.meta.limit,
          totalPages: response.data.meta.totalPages,
          totalProducts: response.data.meta.totalProducts,
          hasPrevPage: response.data.meta.hasPrevPage,
          hasNextPage: response.data.meta.hasNextPage,
        },
      }))
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data.message || "An unexpected error occured"
      }
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }))
    }
  }

  const goToPrevPage = () => {
    if (state.pagination.hasPrevPage) {
      getAllProducts(state.pagination.currPage - 1, 5)
    }
  }

  const goToNextPage = () => {
    if (state.pagination.hasNextPage) {
      getAllProducts(state.pagination.currPage + 1, 5)
    }
  }

  // GET PRODUCT By Id
  const getProductById = async (productId: number) => {
    setState((prevState) => ({ ...prevState, isLoading: true }))

    try {
      const response = await axiosInstance.get(`/api/products/${productId}`)

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message)
      }

      throw new Error("An unexpected error occured")
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }))
    }
  }

  const searchProducts = async (query: string) => {
    try {
      const response = await axiosInstance.get("/api/products/search/product", {
        params: {
          query: query,
        },
      })

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      }
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

  // CREATE
  const createProduct = async (formCreateProduct: Partial<Product>) => {
    try {
      const { ...productFields } = formCreateProduct
      const formData = new FormData()

      Object.entries(productFields).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === "string" || typeof value === "number") {
            formData.append(key, value?.toString())
          } else if (value instanceof File) {
            formData.append(key, value)
          }
        }
      })

      const response = await axiosInstance.post("/api/products", formData, {
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
        const errors = error.response?.data.errors
        if (errors && Array.isArray(errors) && errors.length > 0) {
          setState((prevState) => ({
            ...prevState,
            hasError: errors[0],
          }))

          return
        } else {
          return {
            success: error.response?.data.success,
            message: error.response?.data.message || "An unexpected error occured",
          }
        }
      }
    }
  }

  // UPDATE
  const updateProduct = async (formEditProduct: Partial<Product>) => {
    try {
      const { id, ...productFields } = formEditProduct
      const formData = new FormData()

      Object.entries(productFields).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === "string" || typeof value === "number") {
            formData.append(key, value?.toString())
          } else if (value instanceof File) {
            formData.append(key, value)
          }
        }
      })

      const response = await axiosInstance.patch(`/api/products/${id}`, formData, {
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
        const errors = error.response?.data.errors
        if (errors && Array.isArray(errors) && errors.length > 0) {
          setState((prevState) => ({
            ...prevState,
            hasError: errors[0],
          }))

          return
        } else {
          return {
            success: error.response?.data.success,
            message: error.response?.data.message || "An unexpected error occured",
          }
        }
      }
    }
  }

  // DELETE
  const deleteProduct = async (productId: number | null) => {
    try {
      const response = await axiosInstance.delete(`/api/products/${productId}`, {
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
        return error.response?.data.message
      }

      return {
        success: false,
        message: "An unexpected error occured",
      }
    }
  }

  return {
    products: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
    pagination: state.pagination,
    refetchProducts: () => getAllProducts(state.pagination.currPage),
    getAllProducts,
    goToPrevPage,
    goToNextPage,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
