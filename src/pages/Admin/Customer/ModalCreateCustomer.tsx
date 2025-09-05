import { useState } from "react";
import Modal from "../../../components/Admin/Modal";
import { CustomAlert } from "../../../utils/CustomAlert";
import { useCustomer } from "../../CustomHooks/useCustomer";
import { IRegisterCustomer, Role } from "../../../types/auth.type";
import { Errors } from "../../../types/common.type";
import { AxiosError } from "axios";

type ModalCreateCustomerProps = {
  onClose: () => void;
};

export default function ModalCreateCustomer({ onClose }: ModalCreateCustomerProps) {
  const { registerCustomer } = useCustomer();
  const [hasError, setHasError] = useState<Errors[]>([]);

  // Form Create Customer
  const [formCreateCustomer, setFormCreateCustomer] = useState<IRegisterCustomer>({
    username: "",
    email: "",
    password: "newcustomer",
    confirmPassword: "newcustomer",
    role: Role.CUSTOMER,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormCreateCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegisterCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerCustomer.mutate(formCreateCustomer, {
      onSuccess: (data) => {
        CustomAlert("success", "success", data?.message);
        onClose();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const errors = error.response?.data.errors;
          setHasError(errors);
        } else {
          CustomAlert("error", "error", "Internal server error, please try again later.");
        }
      },
    });
  };

  return (
    <Modal>
      <Modal.Header title="Create New Customer Account" onClose={onClose} />
      <Modal.Body>
        <form onSubmit={handleRegisterCustomer} className="w-[500px] flex flex-col gap-y-3">
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
              placeholder="Input Email here"
              className={`h-[40px]  rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError && hasError[0]?.field === "email" ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
              }`}
              value={formCreateCustomer.email || ""}
              onChange={handleChange}
            />

            {hasError && hasError[0]?.field === "email" && (
              <p className="text-red-500 text-semibold tracking-wider ml-2">{hasError[0].message}</p>
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
  );
}
