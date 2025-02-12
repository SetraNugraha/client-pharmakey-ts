import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { axiosInstance } from "../../axios/axios"
import { useAuth } from "../../Auth/useAuth"
import { Category, Errors } from "../../types"

type Pagination = {
  currPage: number
  limit: number
  totalPages: number
  totalCategories: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

type CategoryState = {
  data: Category[]
  isLoading: boolean
  hasError: Errors | null
  pagination: Pagination
}

export const useCategory = () => {
  const { token } = useAuth()
  const [state, setState] = useState<CategoryState>({
    data: [],
    isLoading: false,
    hasError: null,
    pagination: {
      currPage: 1,
      limit: 0,
      totalPages: 0,
      totalCategories: 0,
      hasPrevPage: false,
      hasNextPage: false,
    },
  })

  // GET
  const getAllCategory = async (page: number = 1, limit: number = 7) => {
    setState((prevState) => ({ ...prevState, isLoading: true }))
    try {
      const response = await axiosInstance.get("/api/category", {
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
          totalCategories: response.data.meta.totalCategories,
          hasPrevPage: response.data.meta.hasPrevPage,
          hasNextPage: response.data.meta.hasNextPage,
        },
      }))
    } catch (error) {
      const errorMessage = error instanceof AxiosError ? error.response?.data.message : "An error ocurred"
      setState((prevState) => ({
        ...prevState,
        hasError: errorMessage[0],
      }))
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }))
    }
  }

  useEffect(() => {
    getAllCategory(1, 7)
  }, [])

  const goToPrevPage = () => {
    if (state.pagination.hasPrevPage) {
      getAllCategory(state.pagination.currPage - 1, state.pagination.limit)
    }
  }

  const goToNextPage = () => {
    if (state.pagination.hasNextPage) {
      getAllCategory(state.pagination.currPage + 1, state.pagination.limit)
    }
  }

  // CREATE
  const createCategory = async (formCreateCategory: Partial<Category>) => {
    try {
      const formData = new FormData()
      const { ...categoryFields } = formCreateCategory

      Object.entries(categoryFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "string") {
            formData.append(key, value.toString().trim())
          } else if (value instanceof File) {
            formData.append(key, value)
          }
        }
      })

      const response = await axiosInstance.post("/api/category", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // Ten Second
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

  // EDIT
  const updateCategory = async (formEditCategory: Partial<Category>) => {
    try {
      const formData = new FormData()
      const { id, ...fieldsCategory } = formEditCategory

      Object.entries(fieldsCategory).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === "string") {
            formData.append(key, value?.toString())
          } else if (value instanceof File) {
            formData.append(key, value)
          }
        }
      })

      const response = await axiosInstance.patch(`/api/category/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
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
  const deleteCategory = async (categoryId: number | null) => {
    try {
      const response = await axiosInstance.delete(`/api/category/${categoryId}`, {
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
    categories: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
    pagination: state.pagination,
    goToPrevPage,
    goToNextPage,
    refetchCategories: getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
