import { Link, useNavigate } from "react-router-dom"

import { Logo } from "../../components/Customer/Logo"
import { InputField } from "../../components/Customer/InputField"
import { useCustomer } from "../CustomHooks/useCustomer"
import { useState } from "react"
import { CustomAlert } from "../../utils/CustomAlert"

type FormRegister = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const { register, hasError } = useCustomer()
  const navigate = useNavigate()

  const [formRegister, setFormRegister] = useState<FormRegister>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormRegister((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await register(formRegister)

    // SUCCESS
    if (result?.success) {
      navigate("/login")
      CustomAlert("Success", "success", result?.message)
    } else {
      if (result?.message) {
        CustomAlert("Error", "error", result?.message)
      }
    }
  }

  return (
    <>
      <section className="min-h-dvh">
        {/* Logo & Name */}
        <div className="pt-[70px] grid place-items-center">
          <Logo />
        </div>

        {/* Card Register */}
        <div className="pt-[50px]">
          <form onSubmit={handleRegister} className="bg-white mx-[24px] rounded-[30px] border border-slate-200">
            <div className="p-[24px]">
              <h1 className="text-2xl font-bold mb-[20px]">New Account</h1>

              {/* Data User */}
              <div className="flex flex-col gap-y-[20px]">
                {/* usernaame */}
                <InputField
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="Write your full name"
                  icon="assets/img/register-profile.png"
                  value={formRegister.username}
                  isError={hasError?.path === "username"}
                  onChange={handleChange}
                />

                {hasError && hasError.path === "username" && (
                  <p className="text-red-500 font-semibold -mt-3 ml-2">{hasError.message}</p>
                )}

                {/* Email */}
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  icon="assets/img/email.png"
                  value={formRegister.email}
                  isError={hasError?.path === "email"}
                  onChange={handleChange}
                />

                {hasError && hasError.path === "email" && (
                  <p className="text-red-500 font-semibold -mt-3 ml-2">{hasError.message}</p>
                )}

                {/* Password */}
                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Protect your password"
                  icon="assets/img/lock.png"
                  value={formRegister.password}
                  isError={hasError?.path === "password"}
                  onChange={handleChange}
                />

                {/* Confirm Password */}
                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Protect your password"
                  icon="assets/img/lock.png"
                  value={formRegister.confirmPassword}
                  isError={hasError?.path === "password"}
                  onChange={handleChange}
                />
              </div>

              {hasError && hasError.path === "password" && (
                <p className="text-red-500 font-semibold m-2">{hasError.message}</p>
              )}

              <button className="bg-[#FD915A] text-white font-bold text-xl text-center h-[48px] w-full rounded-3xl mt-[20px] hover:bg-white hover:text-[#FD915A] transition-all duration-300 ease-in-out hover:border-[2px] hover:border-[#FD915A] shadow-xl">
                Create My Account
              </button>
            </div>
          </form>
        </div>

        <div className="w-full text-center mt-[30px] pb-[50px]">
          <Link to="/login" className="font-bold underline hover:text-blue-500">
            Sign In to My Account
          </Link>
        </div>
      </section>
    </>
  )
}
