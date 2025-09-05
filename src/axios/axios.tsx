import axios from "axios"

axios.defaults.withCredentials = true
const BASE_URL = import.meta.env.VITE_BASE_URL

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})
