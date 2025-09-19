import moment from "moment";
import { IsPaid, Transaction } from "../../../types/transaction.type";
import { convertToRp } from "../../../utils/convertToRp";
import { Pagination } from "../../../types/common.type";
import { useState } from "react";
import ModalTransactionDetail from "./ModalTransactionDetail";

interface Props {
  transactions?: Transaction[];
  isLoading: boolean;
  pagination?: Pagination;
}

export const TableTransactions = ({ transactions, pagination, isLoading }: Props) => {
  const [modalTransactionDetail, setModalTransactionDetail] = useState<boolean>(false);

  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const handleModalTransactionDetail = (transaction: Transaction | null) => {
    setTransaction(transaction);
    setModalTransactionDetail(true);
  };

  const RenderTransactions = () => {
    if (!pagination) return;
    const { page, limit } = pagination;

    const baseNumber = (page - 1) * limit + 1;
    return transactions?.map((transaction, index) => {
      const rowNumber: number = baseNumber + index;
      const paidStatusColor: Record<IsPaid, string> = {
        [IsPaid.PENDING]: "bg-yellow-600",
        [IsPaid.SUCCESS]: "bg-green-600",
        [IsPaid.CANCELLED]: "bg-red-600",
      };

      return (
        <tr key={index} className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          {/* Number */}
          <td className="text-lg text-white font-bold py-4">{rowNumber}</td>
          {/* Email */}
          <td className="text-lg  py-4">{transaction.customer.email}</td>

          {/* Total Price */}
          <td scope="row" className="text-lg tracking-widest py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {convertToRp(transaction.billing.total_amount)}
          </td>

          {/* Checkout Date */}
          <td className="text-lg  py-4">{moment(transaction.created_at).format("HH:mm - DD/MM/YYYY")}</td>

          {/* Payment Method */}
          <td className={`my-3 p-2 tracking-wider text-white font-semibold inline-block rounded-lg uppercase `}>
            {transaction.billing.payment_method}
          </td>

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
              paidStatusColor[transaction.is_paid as IsPaid]
            }`}
          >
            {transaction.is_paid}
          </td>

          {/* Button Detail */}
          <td className="text-lg  py-4">
            <button
              onClick={() => handleModalTransactionDetail(transaction)}
              className="font-medium tracking-wider text-blue-500 hover:underline hover:text-white"
            >
              Detail
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
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
              Payment
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
          {transactions?.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center font-semibold text-slate-600 text-xl py-5">
                No Transactions found
              </td>
            </tr>
          )}

          {/* Render Transactions */}
          {isLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                loading data transactions ...
              </td>
            </tr>
          ) : (
            <RenderTransactions />
          )}
        </tbody>
      </table>

      {/* MODAL TRANSACTION DETAIL */}
      {modalTransactionDetail && transaction !== null && (
        <ModalTransactionDetail transaction={transaction} onClose={() => setModalTransactionDetail(false)} />
      )}
    </>
  );
};
