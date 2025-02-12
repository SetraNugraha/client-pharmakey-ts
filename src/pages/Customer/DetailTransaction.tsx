/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useTransaction } from "../CustomHooks/useTransaction"
import { Transaction } from "../../types"
import { CustomAlert } from "../../utils/CustomAlert"

type DetailPayment = {
  subTotal: number
  tax: number
  deliveryFee: number
  grandTotal: number
}

export default function DetailTransaction() {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const { getTransactionById, sendProof } = useTransaction()
  const [showItems, setShowItems] = useState<boolean>(true)
  const [showPayment, setShowPayment] = useState<boolean>(true)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [proofImage, setProofImage] = useState<Partial<Transaction>>({})
  const [detailPayment, setDetailPayment] = useState<DetailPayment>({
    subTotal: 0,
    tax: 0,
    deliveryFee: 0,
    grandTotal: 0,
  })

  const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, files } = e.target

    setProofImage((prevState) => ({
      ...prevState,
      id: transaction?.id,
      [name]: type === "file" ? files?.[0] : null,
    }))

    CustomAlert("Success", "success", "Proof Uploaded")
  }

  const handleSendProof = async () => {
    const transactionId = transaction?.id ? transaction.id : null
    const result = await sendProof(transactionId, proofImage)

    if (result?.success) {
      CustomAlert("Success", "success", "Proof Send, Wait admin to approve")
      setProofImage({})
    } else {
      CustomAlert("Error", "error", result?.message || "Failed to send proof")
    }
  }

  useEffect(() => {
    const getData = async () => {
      const id = transactionId ? parseInt(transactionId) : null
      const result = await getTransactionById(id)
      setTransaction(result?.data)
    }

    getData()
  }, [transactionId, proofImage])

  // SET DETAIL PAYMENT
  useEffect(() => {
    if (!transaction) return
    const subTotal = transaction?.transaction_detail.reduce((total, item) => total + item.price * item.quantity, 0)
    const tax = (10 / 100) * subTotal
    const deliveryFee = (2 / 100) * subTotal
    const grandTotal = subTotal + tax + deliveryFee

    setDetailPayment((prevState) => ({
      ...prevState,
      subTotal: subTotal,
      tax: tax,
      deliveryFee: deliveryFee,
      grandTotal: grandTotal,
    }))
  }, [transaction])

  const RenderItems = () => {
    if (transaction?.transaction_detail.length === 0) {
      return <p className="font-semibold tracking-wider p-2 ">Cart is empty</p>
    }

    return transaction?.transaction_detail.map((myTransaction, index) => {
      const productImage = myTransaction.product.product_image
        ? `${import.meta.env.VITE_IMAGE_URL}/products/${myTransaction.product.product_image}`
        : "/assets/img/no-image.png"
      return (
        <div key={index} className="relative">
          {/* Products */}
          <Link
            to={`/detail-product/${myTransaction.product.slug}/${myTransaction.product_id}`}
            className="flex items-center justify-between gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:bg-[#FD915A] transition-all duration-300 ease-in-out group">
            <div className="flex items-center  gap-x-3">
              <img src={productImage} alt="product-image" className="size-16 object-contain" />
              <div className="flex flex-col gap-y-1 items-start">
                <h1 className="font-bold group-hover:text-white text-start">{myTransaction.product.name}</h1>
                <p className="font-semibold text-slate-400 group-hover:text-white">
                  Rp. {myTransaction.price.toLocaleString("id-ID") || ""}
                </p>
                <p className="font-semibold text-sm text-slate-400 group-hover:text-white">
                  Quantity: {myTransaction.quantity}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )
    })
  }

  const RenderDetailPayment = () => {
    return (
      <>
        {/* Sub Total */}
        <div className="flex items-center justify-between">
          <h1>Sub Total</h1>
          <p className="font-bold">Rp. {detailPayment.subTotal.toLocaleString("id-ID")}</p>
        </div>

        {/* PPN */}
        <div className="flex items-center justify-between">
          <h1>PPN 10%</h1>
          <p className="font-bold">Rp. {detailPayment.tax.toLocaleString("id-ID")}</p>
        </div>

        {/* Delivery */}
        <div className="flex items-center justify-between">
          <h1>Delivery {"(Promo)"}</h1>
          <p className="font-bold">Rp. {detailPayment.deliveryFee.toLocaleString("id-ID")}</p>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between">
          <h1>Grand Total</h1>
          <p className="font-bold text-[#FD915A]">Rp. {detailPayment.grandTotal.toLocaleString("id-ID")}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <section className="">
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group">
            <img
              src="/assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filster group-hover:invert group-hover:brightness-0"
            />
          </button>
          <h1 className="font-semibold text-xl">Detail Transaction</h1>
          <div></div>
        </div>

        {/* Items / Products */}
        <div className="mt-[30px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Items</h1>
            <button
              onClick={() => setShowItems(!showItems)}
              className="p-2 bg-white rounded-full hover:bg-[#FD915A] transition-all duration-300 ease-in-out group">
              <img
                src={`/assets/img/arrow-${showItems ? "up" : "down"}.png`}
                alt="button-down"
                className="group-hover:filster group-hover:invert group-hover:brightness-0 transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          {/* RENDER ITEMS */}
          {showItems && <div className="mt-[10px] flex flex-col gap-y-3">{<RenderItems />}</div>}
        </div>

        {/* Details Payment */}
        <div className="mt-[30px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Detail Payment</h1>
            <button
              onClick={() => setShowPayment(!showPayment)}
              className="p-2 bg-white rounded-full hover:bg-[#FD915A] transition-all duration-300 ease-in-out group">
              <img
                src={`/assets/img/arrow-${showPayment ? "up" : "down"}.png`}
                alt="button-down"
                className="group-hover:filster group-hover:invert group-hover:brightness-0 transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          {/* RENDER DETAIL PAYMENT */}
          {showPayment && (
            <div className="mt-[10px] px-5 py-7 bg-white rounded-[24px] flex flex-col gap-y-5">
              <RenderDetailPayment />
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="mt-[30px] px-[16px]">
          <div>
            <h1 className="font-bold text-xl">Payment Method</h1>

            {/* Description Payment */}
            <div className="mt-[12px] p-5 bg-white rounded-[24px]">
              {/* Transfer Method */}
              {transaction?.payment_method && (
                <div>
                  <h1 className="font-bold tracking-wider">{transaction.payment_method}</h1>
                  <div className="flex flex-col gap-y-3 mt-5">
                    <div className="flex items-center gap-x-3">
                      <img src="/assets/img/bank.png" alt="bank" />
                      <h1 className="font-semibold">
                        {transaction.payment_method === "TRANSFER"
                          ? "Bank Pharmakey Healty"
                          : "take a photo when the medicine arrives."}
                      </h1>
                    </div>

                    {transaction.payment_method === "TRANSFER" && (
                      <div className="flex items-center gap-x-3">
                        <img src="/assets/img/card-payment.png" alt="card-payment" />
                        <h1 className="font-semibold">0812931283123</h1>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="mt-[30px] pb-[50px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Delivery to</h1>
          </div>

          {/* Data User */}
          <div className="p-5 bg-white rounded-[24px] mt-[10px]">
            <div className="flex flex-col gap-y-3">
              {/* Address */}
              <div className="flex flex-col gap-y-2">
                <h1 className="font-bold tracking-wide text-lg">Address</h1>
                <div className="flex gap-x-2 items-center">
                  <img src="/assets/img/location.png" alt="location" className="size-5" />
                  <p className="font-semibold text-slate-500 tracking-wide">{transaction?.address}</p>
                </div>
              </div>

              {/* City */}
              <div className="flex flex-col gap-y-2">
                <h1 className="font-bold tracking-wide text-lg">City</h1>
                <div className="flex gap-x-2 items-center">
                  <img src="/assets/img/city.png" alt="city" className="size-5" />
                  <p className="font-semibold text-slate-500 tracking-wide">{transaction?.city}</p>
                </div>
              </div>

              {/* Post Code */}
              <div className="flex flex-col gap-y-2">
                <h1 className="font-bold tracking-wide text-lg">Post Code</h1>
                <div className="flex gap-x-2 items-center">
                  <img src="/assets/img/house.png" alt="post_code" className="size-5" />
                  <p className="font-semibold text-slate-500 tracking-wide">{transaction?.post_code}</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-y-2">
                <h1 className="font-bold tracking-wide text-lg">Phone Number</h1>
                <div className="flex gap-x-2 items-center">
                  <img src="/assets/img/call.png" alt="phone_number" className="size-5" />
                  <p className="font-semibold text-slate-500 tracking-wide">{transaction?.phone_number}</p>
                </div>
              </div>

              {/* Note */}
              <div className="flex flex-col gap-y-2">
                <h1 className="font-bold tracking-wide text-lg">Note</h1>
                <div className="flex gap-x-2 items-center">
                  <img src="/assets/img/note.png" alt="note" className="size-5" />
                  <p className="font-semibold text-slate-500 tracking-wide">
                    {transaction?.notes || "Customer didn't add note"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Total & SEND PROOF */}
        <div className="pb-[50px] px-[16px]">
          <div className="flex items-center justify-between p-5 bg-black rounded-[23px]">
            <div>
              <p className="text-gray-300 text-xs font-semibold">Grand Total</p>
              <h1 className="text-2xl text-white font-bold">Rp. {transaction?.total_amount.toLocaleString("id-ID")}</h1>
            </div>

            {/* Upload PROOF */}
            {transaction?.proof === null && transaction?.is_paid === "PENDING" && (
              <div>
                {transaction.id === proofImage.id && proofImage.proof !== null ? (
                  <div className="flex flex-col items-center gap-y-1">
                    <button
                      onClick={handleSendProof}
                      className="cursor-pointer tracking-wider px-5 py-2 bg-sky-500 text-white font-bold rounded-[50px] hover:bg-white hover:text-sky-500 hover:ring-2 hover:ring-sky-500 duration-300">
                      Send Proof
                    </button>
                    <p className="text-white font-semibold italic">Proof Uploaded</p>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="proof"
                      className="cursor-pointer tracking-wider px-6 py-3 bg-[#FD915A] text-white font-bold rounded-[50px] hover:bg-white hover:text-[#FD915A] hover:ring-2 hover:ring-[#FD915A] duration-300">
                      Upload Proof
                    </label>
                    <input hidden type="file" accept="image/*" name="proof" id="proof" onChange={handleUploadProof} />
                  </div>
                )}
              </div>
            )}

            {/* Awaiting Approval */}
            {transaction?.proof !== null && transaction?.is_paid === "PENDING" && (
              <p className=" tracking-wider px-6 py-3 bg-gray-500 text-white font-bold rounded-[50px]">
                Awaiting Approval ...
              </p>
            )}

            {/* SUCCESS */}
            {transaction?.proof !== null && transaction?.is_paid === "SUCCESS" && (
              <p className="tracking-wider px-6 py-3 bg-green-600 text-white font-bold rounded-[50px]">SUCCESS</p>
            )}

            {/* CANCELLED */}
            {transaction?.is_paid === "CANCELLED" && (
              <p className="tracking-wider px-6 py-3 bg-red-600 text-white font-bold rounded-[50px]">CANCELLED</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
