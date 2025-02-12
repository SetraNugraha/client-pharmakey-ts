import Modal from "../../../components/Admin/Modal"
import { Customer } from "../../../types"

type ModalDetailCustomerProps = {
  customer: Customer | null
  onClose: () => void
}

export default function ModalDetailCustomer({ customer, onClose }: ModalDetailCustomerProps) {
  const customerImage = customer?.profile_image
    ? `${import.meta.env.VITE_CUSTOMER_IMAGE_URL}/${customer.profile_image}`
    : "/assets/img/profile-default.png"
  return (
    <Modal>
      <Modal.Header title="Detail Customer" onClose={onClose} />
      <Modal.Body>
        <section className="w-[750px] items-start flex gap-x-10">
          {/* Customer Profile Image */}
          <div className="flex flex-shrink-0">
            <img src={customerImage} alt="customer-image" className="size-60" />
          </div>

          {/* Container Text */}
          <div className="grid grid-cols-2 gap-y-5 w-full">
            {/* Customer Userame */}
            <div className="flex flex-col ">
              <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                Username
              </label>
              <p className="font-semibold text-slate-500">{customer?.username}</p>
            </div>

            {/* Customer Email */}
            <div className="flex flex-col ">
              <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                Email
              </label>
              <p className="font-semibold text-slate-500">{customer?.email}</p>
            </div>

            {/* Customer Phone Number  */}
            <div className="flex flex-col ">
              <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                Phone Number
              </label>
              <p className="font-semibold text-slate-500">{customer?.phone_number || "Not set yet"}</p>
            </div>

            {/* Customer City */}
            <div className="flex flex-col ">
              <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                City
              </label>
              <p className="font-semibold text-slate-500">{customer?.city || "Not set yet"}</p>
            </div>

            {/* Customer Post Code  */}
            <div className="flex flex-col ">
              <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                Post Code
              </label>
              <p className="font-semibold text-slate-500">{customer?.post_code || "Not set yet"}</p>
            </div>

            {/* Customer Address */}
            <div className="flex flex-col ">
              <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                Address
              </label>
              <p className="font-semibold text-slate-500">{customer?.address || "Not set yet"}</p>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  )
}
