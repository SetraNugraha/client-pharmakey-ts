/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from "react-router-dom"
import { useAuth } from "../Auth/useAuth"
import { useEffect } from "react"

export const CustomerLayout = () => {
  const { refreshToken } = useAuth()

  // Handle Rendering User
  useEffect(() => {
    const isAuthUser = async () => {
      await refreshToken()
    }

    isAuthUser()
  }, [])

  return (
    <section className="max-w-md mx-auto bg-[#F7F1F0] ">
      <Outlet />
    </section>
  )
}
