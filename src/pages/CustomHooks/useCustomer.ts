import { useEffect, useState } from "react"
import { axiosInstance } from "../../axios/axios"
import { useAuth } from "../../Auth/useAuth"
import { AxiosError } from "axios"
import { Customer, Errors } from "../../types"

type formDataNewCustomer = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

type Pagination = {
  currPage: number
  limit: number
  totalPages: number
  totalCustomers: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

type CustomerState = {
  data: Customer[]
  isLoading: boolean
  hasError: Errors | null
  pagination: Pagination
}

export const useCustomer = () => {
  const { token } = useAuth()
  const [state, setState] = useState<CustomerState>({
    data: [],
    isLoading: false,
    hasError: null,
    pagination: {
      currPage: 1,
      limit: 0,
      totalPages: 0,
      totalCustomers: 0,
      hasPrevPage: false,
      hasNextPage: false,
    },
  })

  const getAllCustomer = async (page: number = 1, limit: number = 7) => {
    setState((prevState) => ({ ...prevState, isLoading: true }))
    try {
      const response = await axiosInstance.get("/api/users", {
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
          totalCustomers: response.data.meta.totalCustomers,
          hasPrevPage: response.data.meta.hasPrevPage,
          hasNextPage: response.data.meta.hasNextPage,
        },
      }))
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: error.response?.data.success,
          message: error.response?.data.mesage,
        }
      } else {
        return {
          success: false,
          message: "An unexpected error occured",
        }
      }
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }))
    }
  }

  useEffect(() => {
    getAllCustomer(1, 7)
  }, [])

  const goToPrevPage = () => {
    if (state.pagination.hasPrevPage) {
      getAllCustomer(state.pagination.currPage - 1, state.pagination.limit)
    }
  }

  const goToNextPage = () => {
    if (state.pagination.hasNextPage) {
      getAllCustomer(state.pagination.currPage + 1, state.pagination.limit)
    }
  }

  const getCustomerById = async (userId: number | null) => {
    try {
      if (!userId) return
      const response = await axiosInstance.get(`/api/users/${userId}`)
      const { success, message, data } = response.data
      return {
        success: success,
        message: message,
        data: data,
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: error.response?.data.success,
          message: error.response?.data.mesage,
        }
      } else {
        return {
          success: false,
          message: "An unexpected error occured",
        }
      }
    }
  }

  // FOR NEW Customer
  const register = async (formRegister: formDataNewCustomer) => {
    try {
      const { username, email, password, confirmPassword } = formRegister

      const response = await axiosInstance.post("/api/register", {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      })

      return {
        success: response.data.success,
        message: response.data.message,
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorsMessage = error.response?.data.errors
        if (errorsMessage && Array.isArray(errorsMessage) && errorsMessage.length > 0) {
          setState((prevState) => ({
            ...prevState,
            hasError: errorsMessage[0],
          }))
        } else {
          return {
            success: false,
            message: error.response?.data.message || "Error while process register",
          }
        }
      }
    }
  }

  // In ADMIN DASHBOARD
  const createCustomer = async (formDataNewCustomer: formDataNewCustomer) => {
    try {
      const { username, email, password, confirmPassword } = formDataNewCustomer

      const response = await axiosInstance.post("/api/register", {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      })

      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorsMessage = error.response?.data.errors
        if (errorsMessage && Array.isArray(errorsMessage) && errorsMessage.length > 0) {
          setState((prevState) => ({
            ...prevState,
            hasError: errorsMessage[0],
          }))
        } else {
          return {
            success: false,
            message: error.response?.data.message || "Error while process register",
          }
        }
      }
    }
  }

  const editCustomer = async (formEditCustomer: Partial<Customer>) => {
    try {
      const { id, ...customerFields } = formEditCustomer
      const formData = new FormData()

      Object.entries(customerFields).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === "string" || typeof value === "number") {
            formData.append(key, value?.toString())
          } else if (value instanceof File) {
            formData.append(key, value)
          }
        }
      })

      const response = await axiosInstance.patch(`/api/users/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response?.data
      }
    }
  }

  const deleteCustomer = async (customerId: number | null) => {
    try {
      const response = await axiosInstance.delete(`/api/users/delete/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data.message
      }
    }
  }

  return {
    customers: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
    pagination: state.pagination,
    goToPrevPage,
    goToNextPage,
    getAllCustomer,
    getCustomerById,
    register,
    createCustomer,
    editCustomer,
    deleteCustomer,
  }
}
