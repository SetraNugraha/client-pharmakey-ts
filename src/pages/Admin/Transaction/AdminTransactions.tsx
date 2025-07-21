import moment from "moment"
import ModalTransactionDetail from "./ModalTransactionDetail"
import { useState } from "react"
import { useTransaction } from "../../CustomHooks/useTransaction"
import { useCustomer } from "../../CustomHooks/useCustomer"

export default function AdminTransactions() {
  const { transactions, getAllTransactions, pagination, goToPrevPage, goToNextPage } = useTransaction()
  const { customers } = useCustomer()
  const [modalTransactionDetail, setModalTransactionDetail] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<number | null>(null)

  const handleModalTransactionDetail = (transactionId: number | null) => {
    setTransactionId(transactionId)
    setModalTransactionDetail(true)
  }

  const RenderTransactions = () => {
    const baseNumber: number = (pagination.currPage - 1) * pagination.limit + 1
    return transactions.map((transaction, index) => {
      const rowNumber: number = baseNumber + index
      // Find Email
      const customerEmail = customers.find(
        (customer) => customer.id === transaction.user_id && customer.role === "CUSTOMER"
      )
      return (
        <tr
          key={index}
          className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          {/* Number */}
          <td className="text-lg text-white font-bold py-4">{rowNumber}</td>
          {/* Email */}
          <td className="text-lg  py-4">{customerEmail?.email}</td>

          {/* Total Price */}
          <td
            scope="row"
            className="text-lg tracking-widest py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {transaction.total_amount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </td>

          {/* Date */}
          <td className="text-lg  py-4">{moment(transaction.created_at).format("DD-MM-YYYY")}</td>

          {/* Proof status */}
          <td>
            <div className="flex justify-center items-center ">
              {transaction.proof === null ? (
                <p className="font-semibold text-lg tracking-wider text-slate-400">Awaiting</p>
              ) : (
                <p className="font-semibold text-lg tracking-wider text-slate-100">Uploaded</p>
              )}
            </div>
          </td>

          {/* Status */}
          <td
            className={`my-3 p-2 tracking-wider text-white font-semibold inline-block rounded-lg uppercase ${
              transaction.is_paid === "PENDING"
                ? "bg-yellow-600"
                : transaction.is_paid === "SUCCESS"
                ? "bg-green-600"
                : "bg-red-500"
            }`}
          >
            {transaction.is_paid}
          </td>

          {/* Button Detail */}
          <td className="text-lg  py-4">
            <button
              onClick={() => handleModalTransactionDetail(transaction.id || null)}
              className="font-medium tracking-wider text-blue-500 hover:underline hover:text-white"
            >
              Detail
            </button>
          </td>
        </tr>
      )
    })
  }

  return (
    <>
      <section className="px-10 py-5">
        <div>
          <h1 className="font-bold text-2xl mb-5">Transactions</h1>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-gray-500 dark:text-gray-400">
              <thead className="text-gray-800 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="text-center text-[14px]">
                  <th scope="col" className="py-3">
                    No.
                  </th>
                  <th scope="col" className="py-3">
                    Email
                  </th>
                  <th scope="col" className="py-3">
                    Total Transaction
                  </th>
                  <th scope="col" className="py-3">
                    Checkout Date
                  </th>
                  <th scope="col" className="py-3">
                    Proof Status
                  </th>
                  <th scope="col" className="py-3">
                    Status
                  </th>
                  <th scope="col" className="py-3">
                    See Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* If No Transctions */}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center font-semibold text-slate-600 text-xl py-5">
                      No Transactions found
                    </td>
                  </tr>
                )}

                {/* Render Transactions */}
                <RenderTransactions />
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="absolute bottom-24  flex items-center gap-x-3 mt-5 ml-3">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={goToPrevPage}
              className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0"
            >
              Prev
            </button>
            <p className="px-3 py-1 ring-2 ring-slate-300 rounded-lg font-semibold text-slate-400">
              {pagination.currPage}
            </p>
            <button
              disabled={!pagination.hasNextPage}
              onClick={goToNextPage}
              className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0"
            >
              Next
            </button>
          </div>
        </div>
        {modalTransactionDetail && transactionId !== null && (
          <ModalTransactionDetail
            transactionId={transactionId}
            onClose={() => setModalTransactionDetail(false)}
            refreshDataTransactions={getAllTransactions}
          />
        )}
      </section>
    </>
  )
}
