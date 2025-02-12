import { useState } from "react"
import Modal from "../../../components/Admin/Modal"
import { CustomAlert } from "../../../utils/CustomAlert"
import { useCustomer } from "../../CustomHooks/useCustomer"

type FormCreateCustomer = {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: string
}

type ModalCreateCustomerProps = {
  onClose: () => void
  refreshDataCustomer: () => void
}

export default function ModalCreateCustomer({ onClose, refreshDataCustomer }: ModalCreateCustomerProps) {
  const { createCustomer, hasError } = useCustomer()

  // Form Create Customer
  const [formCreateCustomer, setFormCreateCustomer] = useState<FormCreateCustomer>({
    username: "",
    email: "",
    password: "newcustomer",
    confirmPassword: "newcustomer",
    role: "CUSTOMER",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormCreateCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleCreateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await createCustomer(formCreateCustomer)

    if (result.success) {
      setFormCreateCustomer({
        username: "",
        email: "",
        password: "newcustomer",
        confirmPassword: "newcustomer",
        role: "CUSTOMER",
      })
      CustomAlert("Succes", "success", result.message)
      onClose()
      await refreshDataCustomer()
    } else {
      if (result.message) {
        CustomAlert("Error", "error", result.message)
      }
    }
  }

  return (
    <Modal>
      <Modal.Header title="Create New Customer Account" onClose={onClose} />
      <Modal.Body>
        <form onSubmit={handleCreateCustomer} className="w-[500px] flex flex-col gap-y-3">
          {/* Username */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="username" className="font-semibold text-slate-500 ml-1">
              Username
            </label>
            <input
              required
              type="text"
              name="username"
              id="username"
              placeholder="Input Username here"
              className="h-[40px] ring-1 ring-slate-300 rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formCreateCustomer.username || ""}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="email" className="font-semibold text-slate-500 ml-1">
              Email
            </label>
            <input
              required
              type="text"
              name="email"
              id="email"
              placeholder="Input your Email here"
              className={`h-[40px]  rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError && hasError.path === "email" ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
              }`}
              value={formCreateCustomer.email || ""}
              onChange={handleChange}
            />

            {hasError && hasError.path === "email" && (
              <p className="text-red-500 text-semibold tracking-wider ml-2">{hasError.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="password" className="font-semibold text-slate-500 ml-1">
              Password Default
            </label>
            <input
              required
              disabled
              type="text"
              name="password"
              id="password"
              className="h-[40px] ring-1 ring-slate-300 rounded-lg px-5 text-slate-400 font-semibold tracking-widest"
              value={formCreateCustomer.password}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="confirmPassword" className="font-semibold text-slate-500 ml-1">
              Confirm Password Default
            </label>
            <input
              required
              disabled
              type="text"
              name="confirmPassword"
              id="confirmPassword"
              className="h-[40px] ring-1 ring-slate-300 rounded-lg px-5 text-slate-400 font-semibold tracking-widest"
              value={formCreateCustomer.confirmPassword}
            />
          </div>

          {/* Button Submit */}
          <button className="py-2 rounded-lg bg-blue-500 text-white font-semibold text-lg tracking-wider mt-5 shadow-xl hover:oulinte-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
