/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom"
import { InputField } from "../../components/Customer/InputField"
import { useCustomer } from "../CustomHooks/useCustomer"
import { CustomAlert, CustomAlertConfirm } from "../../utils/CustomAlert"
import React, { useEffect, useState } from "react"
import { useAuth } from "../../Auth/useAuth"
import { Customer, Errors } from "../../types"

export default function UpdateProfile() {
  const { user } = useAuth()
  const { getCustomerById, editCustomer } = useCustomer()
  const customerId = user?.userId ? user.userId : null
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<Partial<Customer>>({ id: Number("") })

  const [formEditCustomer, setFormEditCustomer] = useState<Partial<Customer>>({})
  const [uploadedImageName, setUploadedImageName] = useState<string>("")
  const [hasError, setHasError] = useState<Errors>({
    path: "",
    message: "",
  })

  // GET data customer
  useEffect(() => {
    const getCustomerData = async () => {
      const result = await getCustomerById(customerId)
      setCustomer(result?.data)
    }

    getCustomerData()
  }, [customerId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { type, name, value, files } = e.target as HTMLInputElement

    if (type === "file" && files?.length) {
      setUploadedImageName(files[0].name)
    }

    setFormEditCustomer((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files?.[0] : value,
    }))
  }

  const handleEditCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isConfirm = await CustomAlertConfirm("Are you sure want to update profile ?")

    if (isConfirm) {
      const result = await editCustomer(formEditCustomer)
      if (result.success) {
        navigate("/profile")
        setFormEditCustomer({})
        CustomAlert(result.message, "success")
      } else if (!result.success && result.message === "Validation error") {
        setHasError({
          path: result.errors[0].path,
          message: result.errors[0].message,
        })
      } else {
        navigate("/profile")
        setFormEditCustomer({})
        CustomAlert(result.message, "error")
      }
    }
  }

  return (
    <>
      <section className="pb-[50px]">
        <div className="pt-[30px] px-[16px] flex items-center">
          {/* Header */}
          <Link
            to="/profile"
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group">
            <img
              src="assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filter group-hover:invert group-hover:brightness-0"
            />
          </Link>
          <h1 className="font-bold text-xl absolute left-1/2 -translate-x-1/2">Profile</h1>
        </div>

        {/* Data User */}
        <div className="px-[16px]">
          <div className="bg-white mt-[20px] rounded-t-[60px] rounded-b-[60px]">
            <div className="p-5 bg-white rounded-[24px] mt-[10px]">
              <div>
                <form onSubmit={handleEditCustomer} className="flex flex-col gap-y-3">
                  {/* Username */}
                  <InputField
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    icon="assets/img/register-profile.png"
                    value={formEditCustomer.username ?? customer?.username ?? ""}
                    onChange={handleChange}
                  />

                  {/* Email */}
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    icon="assets/img/email.png"
                    isError={hasError.path === "email"}
                    value={formEditCustomer.email ?? customer?.email ?? ""}
                    onChange={handleChange}
                  />

                  {hasError.path === "email" && (
                    <p className="ml-5 -mt-1 text-red-500 font-semibold tracking-wider">{hasError.message}</p>
                  )}

                  {/* Address */}
                  <div className="relative">
                    <label htmlFor="address" className="font-semibold">
                      Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      placeholder="Your address"
                      className="w-full h-full px-12 py-3 mt-2 border border-slate-300 rounded-2xl placeholder:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FD915A]"
                      value={formEditCustomer.address ?? customer?.address ?? ""}
                      onChange={handleChange}></textarea>
                    <img src="assets/img/location.png" alt="note" className="absolute top-[47px] left-[15px]" />
                  </div>

                  <InputField
                    label="City"
                    name="city"
                    type="text"
                    placeholder="City"
                    icon="assets/img/city.png"
                    value={formEditCustomer.city ?? customer?.city ?? ""}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Post Code"
                    name="post_code"
                    type="number"
                    placeholder="Post Code"
                    icon="assets/img/house.png"
                    value={formEditCustomer.post_code ?? customer?.post_code ?? ""}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Phone Number"
                    name="phone_number"
                    type="number"
                    placeholder="Phone Number"
                    icon="assets/img/call.png"
                    value={formEditCustomer.phone_number ?? customer?.phone_number ?? ""}
                    onChange={handleChange}
                  />

                  {/* Photo Profile */}
                  <div>
                    <label htmlFor="photo_profile" className="font-bold">
                      Photo Profile
                    </label>
                    <div className="mt-[10px]">
                      <label
                        htmlFor="profile_image"
                        className="flex items-center gap-x-3 cursor-pointer py-3 text-slate-400 px-3 border border-slate-300 rounded-3xl placeholder:text-[16px] hover:outline-none hover:ring-2 hover:ring-[#FD915A]">
                        <img src="assets/img/folder.png" alt="photo_profile" className="cursor-pointer" />
                        {uploadedImageName ? uploadedImageName : "Select Picture Here"}
                      </label>
                      <input
                        id="profile_image"
                        name="profile_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button className="text-center mt-[10px] tracking-wider px-6 py-3 bg-[#FD915A] text-white font-bold rounded-[50px] hover:bg-white hover:text-[#FD915A] hover:ring-2 hover:ring-[#FD915A] duration-300">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
