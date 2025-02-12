import { Link, useNavigate } from "react-router-dom"

import { Logo } from "../../components/Customer/Logo"
import { InputField } from "../../components/Customer/InputField"
import { useAuth } from "../../Auth/useAuth"
import { useState } from "react"
import { CustomAlert } from "../../utils/CustomAlert"

type Credentials = {
  email: string
  password: string
}

export default function Login() {
  const { loginCustomer, loginCustomerLoading, hasError } = useAuth()
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  })

  const handleLoginCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const loginCustomerResult = await loginCustomer(credentials)

    if (loginCustomerResult && loginCustomerResult.userId) {
      setCredentials({
        email: "",
        password: "",
      })
      navigate("/")
      CustomAlert("Login Success", "success", `Welcome ${loginCustomerResult.username}`)
    }
  }

  return (
    <>
      <section className="min-h-dvh">
        {/* Logo & Name */}
        <div className="pt-[70px] grid place-items-center">
          <Logo />
        </div>

        {/* Card Login */}
        <div className="pt-[50px]">
          <form onSubmit={handleLoginCustomer} className="bg-white mx-[24px] rounded-[30px] border border-slate-200">
            <div className="p-[24px]">
              <h1 className="text-2xl font-bold mb-[20px]">Sign In</h1>

              <div className="flex flex-col gap-y-[20px]">
                {/* Email */}
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  icon="assets/img/email.png"
                  value={credentials.email || ""}
                  isError={hasError.path === "email"}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      email: e.target.value,
                    })
                  }
                />

                {hasError && hasError.path === "email" && (
                  <p className="ml-5 -mt-3 text-red-500 font-semibold tracking-wider">{hasError.message}</p>
                )}

                {/* Password */}
                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Protect your password"
                  icon="assets/img/lock.png"
                  value={credentials.password || ""}
                  isError={hasError.path === "password"}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              {hasError && hasError.path === "password" && (
                <p className="ml-5 mt-2 text-red-500 font-semibold tracking-wider">{hasError.message}</p>
              )}

              <button
                disabled={loginCustomerLoading}
                className="bg-[#FD915A] text-white font-bold text-xl text-center h-[48px] w-full rounded-3xl mt-[20px] hover:bg-white hover:text-[#FD915A] transition-all duration-300 ease-in-out hover:border-[2px] hover:border-[#FD915A] shadow-xl disabled:cursor-not-allowed disabled:bg-slate-500 disabled:hover:text-white disabled:outline-none disabled:hover:border-opacity-0">
                {loginCustomerLoading ? "Process Login ..." : "Login"}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full text-center mt-[30px] pb-[80px]">
          <Link to="/register" className="font-bold underline hover:text-blue-500">
            Create New Account
          </Link>
        </div>
      </section>
    </>
  )
}
