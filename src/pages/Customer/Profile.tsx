/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom"
import { Navbar } from "../../components/Customer/Navbar"
import { useAuth } from "../../Auth/useAuth"
import { useCustomer } from "../CustomHooks/useCustomer"
import { useEffect, useState } from "react"
import { CustomAlert, CustomAlertConfirm } from "../../utils/CustomAlert"
import { Customer } from "../../types"
import { getImageUrl } from "../../utils/getImageUrl"


export default function Profile() {
  const { user, logout } = useAuth()
  const { getCustomerById } = useCustomer()
  const [customer, setCustomer] = useState<Partial<Customer>>({ id: Number("") })
  const profileImage = customer.profile_image
    ? getImageUrl("customers", customer.profile_image)
    : "assets/img/profile-default.png"

  const navigate = useNavigate()
  const customerId = user?.userId ? user.userId : null

  useEffect(() => {
    const getCustomerData = async () => {
      try {
        const result = await getCustomerById(customerId)
        setCustomer(result?.data)
      } catch (error) {
        console.error(error)
        return
      }
    }

    getCustomerData()
  }, [customerId])

  const handleLogoutCustomer = async () => {
    const isConfim = await CustomAlertConfirm("Are you sure want to logout ?")

    if (isConfim) {
      try {
        await logout()
        navigate("/")
        CustomAlert("Logout Success", "success")
      } catch (error) {
        console.error(error)
        navigate("/")
        CustomAlert("Error while process logout", "error")
        return
      }
    } else {
      CustomAlert("Logout Cancelled", "warning")
    }
  }

  return (
    <>
      <section className="min-h-dvh">
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          <Link
            to="/"
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group">
            <img
              src="assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filter group-hover:invert group-hover:brightness-0"
            />
          </Link>
          <h1 className="font-bold text-xl absolute left-1/2 -translate-x-1/2">Profile</h1>
          <button
            onClick={handleLogoutCustomer}
            className="px-3 py-1 bg-red-500 text-white font-semibold rounded-lg tracking-wide text-sm hover:outlie-none hover:ring-2 hover:ring-red-500 hover:bg-white hover:text-red-500 shadow-md shadow-slate-400 duration-300">
            Logout
          </button>
        </div>

        {/* Image & Username */}
        <div className="flex flex-col items-center justify-center gap-5 mt-[20px]">
          <img src={profileImage} alt="profile_image" className="size-36 object-contain p-2 bg-white rounded-full" />
          <div className="text-center leading-[1]">
            <h1 className="font-bold text-xl tracking-wider">{customer?.username || "Guest"}</h1>
            <p className="font-semibold text-slate-500 tracking-wider">{customer?.email || "unknown"}</p>
          </div>
        </div>

        {/* Data User */}
        <div className="px-[16px] pb-[130px]">
          <div className="bg-white mt-[20px] rounded-t-[60px] rounded-b-[60px]">
            {/* Address */}
            <div className="p-5 bg-white rounded-[24px] mt-[10px]">
              <div className="flex flex-col gap-y-5">
                {/* Address */}
                <div className="flex flex-col gap-y-3">
                  <h1 className="font-semibold">Address : </h1>
                  <div className="flex items-center gap-x-2 ml-3">
                    <img src="assets/img/location.png" alt="city" />
                    <p className="text-slate-400 font-semibold tracking-wider">{customer?.address || "Not set"}</p>
                  </div>
                </div>

                {/* City */}
                <div className="flex flex-col gap-y-3">
                  <h1 className="font-semibold">City : </h1>
                  <div className="flex items-center gap-x-2 ml-3">
                    <img src="assets/img/city.png" alt="city" />
                    <p className="text-slate-400 font-semibold tracking-wider">{customer?.city || "Not set"}</p>
                  </div>
                </div>

                {/* Post Code */}
                <div className="flex flex-col gap-y-3">
                  <h1 className="font-semibold">Post Code : </h1>
                  <div className="flex items-center gap-x-2 ml-3">
                    <img src="assets/img/house.png" alt="post_code" />
                    <p className="text-slate-400 font-semibold tracking-wider">{customer?.post_code || "Not set"}</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-y-3">
                  <h1 className="font-semibold">Phone Number : </h1>
                  <div className="flex items-center gap-x-2 ml-3">
                    <img src="assets/img/call.png" alt="post_code" />
                    <p className="text-slate-400 font-semibold tracking-wider">{customer?.phone_number || "Not set"}</p>
                  </div>
                </div>

                <Link
                  to="/update-profile"
                  className="text-center mt-[10px] tracking-wider px-6 py-3 bg-[#FD915A] text-white font-bold rounded-[50px] hover:bg-white hover:text-[#FD915A] hover:ring-2 hover:ring-[#FD915A] duration-300 shadow-md shadow-slate-400">
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navbar */}
        <Navbar />
      </section>
    </>
  )
}
