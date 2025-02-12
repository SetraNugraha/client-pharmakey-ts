/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { axiosInstance } from "../../axios/axios"
import { useAuth } from "../../Auth/useAuth"
import { AxiosError } from "axios"
import { Transaction, Errors } from "../../types"

type Pagination = {
  currPage: number
  limit: number
  totalPages: number
  totalTransactions: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

type TransactionsState = {
  data: Transaction[]
  isLoading: boolean
  hasError: Errors | null
  pagination: Pagination
}

export const useTransaction = () => {
  const { token } = useAuth()
  const [state, setState] = useState<TransactionsState>({
    data: [],
    isLoading: false,
    hasError: null,
    pagination: {
      currPage: 1,
      limit: 0,
      totalPages: 0,
      totalTransactions: 0,
      hasPrevPage: false,
      hasNextPage: false,
    },
  })

  // ADMIN
  const getAllTransactions = async (page: number = 1, limit: number = 7) => {
    setState((prevState) => ({ ...prevState, isLoading: true }))
    try {
      const response = await axiosInstance.get("/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          totalTransactions: response.data.meta.totalTransactions,
          hasPrevPage: response.data.meta.hasPrevPage,
          hasNextPage: response.data.meta.hasNextPage,
        },
      }))
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
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }))
    }
  }

  useEffect(() => {
    getAllTransactions(1, 9)
  }, [])

  const goToPrevPage = () => {
    if (state.pagination.hasPrevPage) {
      getAllTransactions(state.pagination.currPage - 1, state.pagination.limit)
    }
  }

  const goToNextPage = () => {
    if (state.pagination.hasNextPage) {
      getAllTransactions(state.pagination.currPage + 1, state.pagination.limit)
    }
  }

  // ADMIN
  const getTransactionById = async (transactionId: number | null) => {
    try {
      const response = await axiosInstance.get(`/api/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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

  // ADMIN
  const updateStatusPaid = async (transactionId: number | null, toStatus: string) => {
    try {
      const response = await axiosInstance.put(`/api/transactions/${transactionId}/${toStatus}`, null, {
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

  // CUSTOMER
  const getCustomerTransactions = async () => {
    try {
      const response = await axiosInstance.get("/api/transactions/customer/mytransactions", {
        headers: {
          Authorization: `Bearer ${token}`,
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
          message: error.response?.data.message || "An unexpected error occured",
        }
      } else if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        }
      }
    }
  }

  // CUSTOMER
  const checkout = async (formCheckout: Partial<Transaction>) => {
    try {
      if (!token) return

      const response = await axiosInstance.post("/api/transactions/checkout", formCheckout, {
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
        const errorMessage = error.response?.data.errors
        if (errorMessage && Array.isArray(errorMessage) && errorMessage.length > 0) {
          setState((prevState) => ({
            ...prevState,
            hasError: errorMessage[0],
          }))
        } else {
          return {
            success: error.response?.data.success,
            message: error.response?.data.message || "An unexpected error occured",
          }
        }
      }
    }
  }

  // CUSTOMER
  const sendProof = async (transactionId: number | null, proofImage: Partial<Transaction>) => {
    try {
      if (!token) return

      const formData = new FormData()
      const { proof } = proofImage

      if (proof && proof instanceof File) {
        formData.append("proof", proof)
      }

      const response = await axiosInstance.put(`/api/transactions/customer/proof/${transactionId}`, formData, {
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
          message: error.response?.data.message || "An unexpected error occured",
        }
      } else if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        }
      }
    }
  }

  return {
    transactions: state.data,
    isLoading: state.isLoading,
    hasErrors: state.hasError,
    pagination: state.pagination,
    goToPrevPage,
    goToNextPage,
    getAllTransactions,
    getTransactionById,
    updateStatusPaid,
    getCustomerTransactions,
    checkout,
    sendProof,
  }
}
