/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import Modal from "../../../components/Admin/Modal"
import { useTransaction } from "../../CustomHooks/useTransaction"
import { useCustomer } from "../../CustomHooks/useCustomer"
import moment from "moment"
import { CustomAlertConfirm, CustomAlert } from "../../../utils/CustomAlert"
import { Transaction } from "../../../types"
import { getImageUrl } from "../../../utils/getImageUrl"

type ModalTransactionDetailProps = {
  transactionId: number | null
  onClose: () => void
  refreshDataTransactions: () => void
}

export default function ModalTransactionDetail({
  onClose,
  refreshDataTransactions,
  transactionId,
}: ModalTransactionDetailProps) {
  const { getTransactionById, updateStatusPaid } = useTransaction()
  const { customers } = useCustomer()
  const [transactionData, setTransactionData] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // GET Detail Transactio By ID
  useEffect(() => {
    const getTransactionData = async () => {
      setIsLoading(true)
      try {
        const response = await getTransactionById(transactionId)

        if (response.success) {
          setTransactionData(response.data)
        } else {
          setTransactionData(null)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    getTransactionData()
  }, [transactionId])

  const RenderDataTransaction = () => {
    const transactionDataId = transactionData?.id || null
    const customerEmail = customers.find((customer) => customer.id === transactionData?.user_id)
    const proofImage = getImageUrl("proofTransaction", transactionData?.proof)

    if (!transactionData) return

    const handleUpdateIsPaid = async (toStatus: string) => {
      const title =
        toStatus === "success"
          ? "Are you sure want to APPROVE this Transaction ?"
          : "Are you sure want to CANCEL this Transaction"

      const isConfirm = await CustomAlertConfirm(title)

      if (isConfirm) {
        const response = await updateStatusPaid(transactionDataId, toStatus)
        if (response.success) {
          CustomAlert("Success", "success", response.message)
          onClose()
          await refreshDataTransactions()
        } else {
          CustomAlert("Error", "error", response)
        }
      } else {
        CustomAlert("Cancel", "error", "Cancelled to update status transaction")
      }
    }

    return (
      <div className="w-[900px]">
        {/* Header */}
        <div className="relative flex items-center justify-between pb-5">
          {/* Email */}
          <div>
            <h1 className="text-slate-400 font-semibold">Email</h1>
            <p className="font-bold text-lg">{customerEmail?.email}</p>
          </div>

          {/* Total Transaction */}
          <div>
            <h1 className="text-slate-400 font-semibold">Total Transaction</h1>
            <p className="font-bold text-xl tracking-wider">
              {transactionData.total_amount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>

          {/* Date */}
          <div>
            <h1 className="text-slate-400 font-semibold">Date</h1>
            <p className="font-bold text-xl">{moment(transactionData.created_at).format("DD-MM-YYYY")}</p>
          </div>

          {/* Status */}
          <div>
            <p
              className={`my-3 p-2 tracking-wider text-white font-semibold inline-block rounded-lg uppercase ${
                transactionData.is_paid === "PENDING"
                  ? "bg-yellow-600"
                  : transactionData.is_paid === "SUCCESS"
                  ? "bg-green-600"
                  : "bg-red-500"
              }`}>
              {transactionData.is_paid}
            </p>
          </div>

          {/* Horizontal line */}
          <div className="absolute bottom-0 h-[2px] w-full border border-slate-300 opacity-50"></div>
        </div>

        <div className="flex items-start justify-between gap-x-20 max-h-[520px] overflow-y-auto">
          {/* Container Left Content */}
          <div className="w-1/2">
            {/* List Product */}
            <div className="flex flex-col gap-y-3">
              <h1 className="font-bold text-xl my-5 tracking-wide">List of Items</h1>
              {transactionData.transaction_detail.map((item, index) => {
                const productImage = getImageUrl("products", item.product.product_image)
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-x-5">
                      <img src={productImage} alt="product-image" className="w-[35px]" />
                      <div>
                        {/* Name */}
                        <h1 className="font-bold">{item.product.name}</h1>

                        {/* Price */}
                        <p className="font-semibold text-slate-400">
                          {item.price.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <p className="font-semibold text-slate-500">quantity : {item.quantity}</p>
                  </div>
                )
              })}
            </div>

            {/* Price Details */}
            <div>
              <h1 className="font-bold text-xl my-5 tracking-wide">Price Details</h1>
              <div className="flex flex-col gap-y-3">
                {/* Sub Total */}
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Sub Total Items</h1>
                  <p className="font-bold">
                    {transactionData.sub_total.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Tax 10%</h1>
                  <p className="font-bold">
                    {transactionData.tax.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>

                {/* Delivery Fee */}
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Delivery Fee 5%</h1>
                  <p className="font-bold">
                    {transactionData.delivery_fee.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>

                {/* Grand Total */}
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Grand Total</h1>
                  <p className="font-bold">
                    {transactionData.total_amount.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Details of Delivery */}
            <div>
              <h1 className="font-bold text-xl my-5 tracking-wide">Details of Delivery</h1>

              {/* Address */}
              <div className="flex flex-col gap-y-5">
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Address</h1>
                  <p className="font-bold">{transactionData.address}</p>
                </div>

                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">City</h1>
                  <p className="font-bold">{transactionData.city}r</p>
                </div>

                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Post Code</h1>
                  <p className="font-bold">{transactionData.post_code}</p>
                </div>

                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Phone Number</h1>
                  <p className="font-bold">{transactionData.phone_number}</p>
                </div>
              </div>
              {/* Notes */}
              <div className="flex flex-col my-5">
                <h1 className="font-semibold text-slate-400">Note : </h1>
                <p className="font-bold">{transactionData.notes !== null ? transactionData.notes : "No notes found"}</p>
              </div>
            </div>
          </div>

          {/* Container Right Content */}
          <div className="w-1/2 pr-5">
            {/* Proof of Payment */}
            <h1 className="font-bold text-xl my-5 tracking-wide">Proof of Payment</h1>
            {transactionData.proof !== null ? (
              <img src={proofImage} alt="proof-payment" className="max-h-[500px] object-contain" />
            ) : (
              <p className="font-semibold text-slate-600 tracking-wider py-2 mr-5 px-3 rounded-lg bg-slate-200">
                No payment proof has been sent yet.
              </p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="relative flex items-center justify-between">
          {/* If PENDING */}
          {transactionData.is_paid === "PENDING" && (
            <>
              <div className="absolute top-0 h-[2px] w-full border border-slate-300 opacity-50"></div>
              <button
                onClick={() => handleUpdateIsPaid("success")}
                className="px-3 py-2 mt-5 bg-blue-500 text-white font-semibold rounded-lg tracking-wide shadow-xl hover:bg-white hover:text-blue-500 hover:outline-none hover:ring-2 hover:ring-blue-500 duration-300">
                Approve
              </button>
              <button
                onClick={() => handleUpdateIsPaid("cancelled")}
                className="px-3 py-2 mt-5 bg-red-500 text-white font-semibold rounded-lg tracking-wide shadow-xl hover:bg-white hover:text-red-500 hover:outline-none hover:ring-2 hover:ring-red-500 duration-300">
                Cancel
              </button>
            </>
          )}

          {/* If SUCESS */}
          {transactionData.is_paid === "SUCCESS" && (
            <>
              <div className="absolute top-0 h-[2px] w-full border border-slate-300 opacity-50"></div>
              <p className="flex flex-col mt-5 font-bold tracking-wider text-green-600">
                This transaction has been successfully completed,
                <span>on {moment(transactionData.updated_at).format("DD-MM-YYYY")}</span>
              </p>
            </>
          )}

          {/*If CANCELLED */}
          {transactionData.is_paid === "CANCELLED" && (
            <>
              <div className="absolute top-0 h-[2px] w-full border border-slate-300 opacity-50"></div>
              <p className="flex flex-col mt-5 font-semibold tracking-widest text-red-600">
                This Transaction has been Cancelled,
                <span>on {moment(transactionData.updated_at).format("DD-MM-YYYY")}</span>
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Modal>
        <Modal.Header title="Detail Transaction" onClose={onClose} />
        <Modal.Body>
          {isLoading ? (
            <h1 className="font-semibold tracking-wider text-xl w-[400px]">Loading data ...</h1>
          ) : (
            <RenderDataTransaction />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
