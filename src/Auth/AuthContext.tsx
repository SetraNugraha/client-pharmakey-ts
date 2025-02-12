/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../axios/axios"

type Role = "ADMIN" | "CUSTOMER"

type User = {
  userId: number
  username: string
  email: string
  role: Role
  exp: number
}

type ErrorMessage = {
  path: string
  message: string
}

type AuthContextType = {
  loginAdmin: (credentials: LoginCredentials) => Promise<User>
  loginCustomer: (credentials: LoginCredentials) => Promise<User>
  logout: () => Promise<void>
  refreshToken: () => Promise<string | null>
  setUser: Dispatch<SetStateAction<User | null>>
  setToken: Dispatch<SetStateAction<string | null>>
  user: User | null
  token: string | null
  expired: number | null
  isLoading: boolean
  loginCustomerLoading: boolean
  hasError: ErrorMessage
}

type LoginCredentials = {
  email: string
  password: string
}

interface AuthContextProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [expired, setExpired] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loginCustomerLoading, setLoginCustomerLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<ErrorMessage>({
    path: "",
    message: "",
  })

  const loginAdmin = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.post("/api/admin/login", credentials)
      const { accessToken } = response.data
      setToken(accessToken)
      const userData: User = jwtDecode(accessToken)
      setUser(userData)
      setExpired(userData.exp)
      setHasError({
        path: "",
        message: "",
      })

      return userData
    } catch (error) {
      // SET Error Message
      if (error instanceof AxiosError) {
        const errors = error.response?.data.errors || []
        if (errors && Array.isArray(errors) && errors.length > 0) {
          setHasError({
            path: errors[0].path,
            message: errors[0].message,
          })
        }
      }

      setToken(null)
      setUser(null)
      setExpired(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginCustomer = async (credentials: LoginCredentials): Promise<User> => {
    setLoginCustomerLoading(true)
    try {
      const response = await axiosInstance.post("/api/customer/login", credentials)
      const { accessToken } = response.data
      setToken(accessToken)
      const userData: User = jwtDecode(accessToken)
      setUser(userData)
      setExpired(userData.exp)
      setHasError({
        path: "",
        message: "",
      })

      return userData
    } catch (error) {
      // SET Error Message
      if (error instanceof AxiosError && error.response) {
        const errors = error.response.data.errors || []
        if (errors && Array.isArray(errors) && errors.length > 0) {
          setHasError({
            path: errors[0].path,
            message: errors[0].message,
          })
        }
      }

      setToken(null)
      setUser(null)
      setExpired(null)
      throw error
    } finally {
      setLoginCustomerLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.delete("/api/logout")
      setToken(null)
      setUser(null)
      setExpired(null)
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data.message
      }

      throw error
    }
  }

  // Refresh Token
  const refreshToken = async (): Promise<string | null> => {
    try {
      const response = await axiosInstance.get("/api/token")
      const { accessToken } = response.data
      setToken(accessToken)
      const userData: User = jwtDecode(accessToken)
      setUser(userData)
      setExpired(userData.exp)

      return accessToken
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setHasError(error.response.data.message || "Error While Refreshing Token")
        setToken(null)
        setUser(null)
        setExpired(null)
      }
      return null
    }
  }

  // Check Expired Access Token
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const currentDate = new Date()
        if (expired && expired * 1000 < currentDate.getTime()) {
          try {
            const newToken = await refreshToken()
            if (newToken) {
              config.headers.Authorization = `Bearer ${newToken}`
            } else if (token) {
              config.headers.Authorization = `Bearer ${token}`
            }
          } catch (error) {
            if (error instanceof AxiosError && error.response) {
              navigate("/")
            }
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    return () => {
      axiosInstance.interceptors.request.eject(interceptor)
    }
  }, [token, expired])

  const value: AuthContextType = {
    loginAdmin,
    loginCustomer,
    logout,
    setUser,
    setToken,
    refreshToken,
    user,
    token,
    expired,
    isLoading,
    loginCustomerLoading,
    hasError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
