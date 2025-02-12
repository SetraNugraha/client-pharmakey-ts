import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Auth/useAuth"
import { CustomAlert } from "../../utils/CustomAlert"

interface loginFormData {
  email: string
  password: string
}

export default function AdminLogin() {
  const { loginAdmin, hasError, isLoading } = useAuth()
  const navigate = useNavigate()
  const [loginForm, setLoginForm] = useState<loginFormData>({
    email: "",
    password: "",
  })

  const handleLoginAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const loginAdminResult = await loginAdmin(loginForm)

      if (loginAdminResult && loginAdminResult.userId) {
        setLoginForm({
          email: "",
          password: "",
        })

        navigate("/admin/dashboard")
        CustomAlert("Login Success", "success", `Welcome Admin ${loginAdminResult.username}`)
      }
    } catch (error) {
      console.error("auth login context: ", error)
    }
  }

  return (
    <>
      <section className="h-screen flex justify-center items-center">
        <div className="p-5 border border-slate-100 shadow-xl rounded-lg w-[400px]">
          <h1 className="font-bold text-xl text-slate-500 mb-5">Pharmakey Admin Login</h1>
          <form onSubmit={handleLoginAdmin} className="flex flex-col gap-2">
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-semibold text-slate-400 tracking-wider">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                value={loginForm.email || ""}
                required
                className="h-[35px] border border-slate-300 rounded-lg px-5 focus:outline-none focus:border-[2px] focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-semibold text-slate-400 tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                value={loginForm.password || ""}
                required
                className="h-[35px] border border-slate-300 rounded-lg px-5 focus:outline-none focus:border-[2px] focus:border-blue-500"
              />
              {hasError && (
                <div>
                  <p className="text-red-500 tracking-wider">{hasError.message}</p>
                </div>
              )}
            </div>

            {/* Button Login */}
            <button
              disabled={isLoading}
              className="py-2 bg-blue-500 text-white tracking-wider font-semibold rounded-lg shadow-xl mt-5 text-lg hover:oulinte-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-200">
              {isLoading ? "Process Authentication" : "Login"}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
