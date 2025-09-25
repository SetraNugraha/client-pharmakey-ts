import { MdDelete, MdLibraryAdd } from "react-icons/md";
import { IoListCircleSharp } from "react-icons/io5";
import { useCustomer } from "../../CustomHooks/useCustomer";
import ModalCreateCustomer from "./ModalCreateCustomer";
import ModalDetailCustomer from "./ModalDetailCustomer";
import { CustomAlert, CustomAlertConfirm } from "../../../utils/CustomAlert";
import { useState } from "react";
import { Customer } from "../../../types/customer.type";
import { getImageUrl } from "../../../utils/getImageUrl";

export default function AdminCustomer() {
  const { customers, isLoading, pagination, goToNextPage, goToPrevPage, deleteCustomer } = useCustomer();
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [modalDetail, setModalDetail] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleButtonlDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalDetail(true);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    const title = `Are you sure want to delete account ${customer.username} ?`;
    const isConfirm = await CustomAlertConfirm(title);

    if (isConfirm) {
      deleteCustomer.mutate(customer.id, {
        onSuccess: (data) => {
          CustomAlert("Success", "success", data.message);
        },
        onError: (error: any) => {
          CustomAlert("Error", "error", error.response?.data.message || "Internal server error, please try again later.");
        },
      });
    } else {
      CustomAlert("Cancel", "error", "Delete Cancelled");
    }
  };

  const RenderCustomer = () => {
    return customers?.map((customer) => {
      const customerImage = getImageUrl("customers", customer.profile_image);
      return (
        <tr key={customer.id} className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          {/* Profile Image */}
          <td className="py-3 flex justify-center items-cente">
            <img src={customerImage} alt="image-product" className="size-16 rounded-full" />
          </td>

          {/* name */}
          <td className="py-3 tracking-widest text-[20px] text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {customer.username}
          </td>

          {/* Email */}
          <td className="py-3 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.email}</td>

          {/* Phone Number */}
          <td className="py-3 text-center font-medium tracking-widest text-gray-900 whitespace-nowrap dark:text-white">
            {customer.phone_number || "Not set yet"}
          </td>

          {/* Action Button */}
          <td className="py-3">
            <div className="flex items-center justify-center gap-x-3">
              {/* DETAIL */}
              <button onClick={() => handleButtonlDetail(customer)}>
                <IoListCircleSharp size={30} className="text-yellow-500 hover:text-sky-400 duration-200" />
              </button>

              {/* DELETE */}
              <button onClick={() => handleDeleteCustomer(customer)}>
                <MdDelete size={30} className="text-red-500 hover:text-slate-400 duration-200" />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <section className="px-10 py-5">
        <div>
          {/* Title */}
          <h1 className="font-bold text-2xl mb-5">Customer</h1>

          {/* Button Create Customer */}
          <button
            onClick={() => setModalCreate(true)}
            className="px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 hover:outline-none hover:ring-2 hover:ring-blue-500 duration-300 mb-5 flex items-center gap-x-2 shadow-lg shadow-gray-300"
          >
            <span>
              <MdLibraryAdd size={22} />
            </span>
            Create Customer Account
          </button>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Profile
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="font-semibold text-slate-400 tracking-wider">
                    <td colSpan={5} className="py-5 text-center text-xl">
                      Loading data customer...
                    </td>
                  </tr>
                ) : (
                  <RenderCustomer />
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="absolute bottom-24  flex items-center gap-x-3 mt-5 ml-3">
            <button
              disabled={!pagination?.isPrev}
              onClick={goToPrevPage}
              className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0"
            >
              Prev
            </button>
            <p className="px-3 py-1 ring-2 ring-slate-300 rounded-lg font-semibold text-slate-400">{pagination?.page}</p>
            <button
              disabled={!pagination?.isNext}
              onClick={goToNextPage}
              className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0"
            >
              Next
            </button>
          </div>
        </div>

        {/* Create */}
        {modalCreate && <ModalCreateCustomer onClose={() => setModalCreate(false)} />}

        {/* Detail */}
        {modalDetail && <ModalDetailCustomer customer={selectedCustomer} onClose={() => setModalDetail(false)} />}
      </section>
    </>
  );
}
