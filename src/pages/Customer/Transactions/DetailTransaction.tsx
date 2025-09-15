/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTransaction } from "../../CustomHooks/useTransaction";
import { CustomAlert } from "../../../utils/CustomAlert";
import { useAuth } from "../../../Auth/useAuth";
import { Transaction } from "../../../types/transaction.type";
import { getImageUrl } from "../../../utils/getImageUrl";
import { convertToRp } from "../../../utils/convertToRp";
import { DetailPayment } from "../Carts/DetailPayment";
import moment from "moment";

interface Proof {
  transactionId: string;
  proof: File | null;
}

export default function DetailTransaction() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactionId } = useParams();
  const { transactions, isLoading, sendProof } = useTransaction({ customerId: user?.userId });
  const [showItems, setShowItems] = useState<boolean>(true);
  const [showPayment, setShowPayment] = useState<boolean>(true);
  const [transaction, setTransaction] = useState<Partial<Transaction | undefined>>({});

  const [proofImage, setProofImage] = useState<Proof>({
    transactionId: "",
    proof: null,
  });

  useEffect(() => {
    if (!transactions || !transactionId) return;

    const isTransaction = transactions?.find((trx) => trx.id === transactionId);
    setTransaction(isTransaction);
  }, [transactions, transactionId]);

  const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!transaction?.id) return;

    setProofImage({
      transactionId: transaction?.id,
      proof: e.target.files?.[0] || null,
    });

    CustomAlert("Success", "success", "Proof Uploaded");
  };

  const handleSendProof = async () => {
    if (!transaction?.id) return;

    sendProof.mutate(
      { transactionId: transaction.id, imageProof: proofImage.proof },
      {
        onSuccess: () => {
          CustomAlert("Success", "success", "Proof Send, Wait admin to approve");
          setProofImage({ transactionId: "", proof: null });
        },
        onError: (error) => {
          CustomAlert("Error", "error", error?.message || "Error while sending proof");
        },
      }
    );
  };

  const RenderItems = () => {
    return transaction?.transaction_detail?.map((trx, index) => {
      const productImage = getImageUrl("products", trx?.product.product_image);
      return (
        <div key={index} className="relative">
          {/* Products */}
          <Link
            to={`/detail-product/${trx?.product?.slug}/${trx?.product.id}`}
            className="flex items-center justify-between gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:bg-[#FD915A] transition-all duration-300 ease-in-out group"
          >
            <div className="flex items-center  gap-x-3">
              <img src={productImage} alt="product-image" className="size-16 object-contain" />
              <div className="flex flex-col gap-y-1 items-start">
                <h1 className="font-bold group-hover:text-white text-start">{trx?.product?.name}</h1>
                <p className="font-semibold text-slate-400 group-hover:text-white">{convertToRp(trx?.price)}</p>
                <p className="font-semibold text-sm text-slate-400 group-hover:text-white">Quantity: {trx?.quantity}</p>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  return (
    <>
      <section>
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          <button
            disabled={isLoading}
            onClick={() => navigate(-1)}
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <img src="/assets/img/arrow-left.png" alt="back-button" className="group-hover:filster group-hover:invert group-hover:brightness-0" />
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
              className="p-2 bg-white rounded-full hover:bg-[#FD915A] transition-all duration-300 ease-in-out group"
            >
              <img
                src={`/assets/img/arrow-${showItems ? "up" : "down"}.png`}
                alt="button-down"
                className="group-hover:filster group-hover:invert group-hover:brightness-0 transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          {/* RENDER ITEMS */}
          {isLoading ? (
            <>
              <h1 className="text-center font-semibold italic">Loading Data ....</h1>
            </>
          ) : (
            showItems && <div className="mt-[10px] flex flex-col gap-y-3">{<RenderItems />}</div>
          )}
        </div>

        {/* BILLING */}
        <div className="mt-[30px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Detail Payment</h1>
            <button
              onClick={() => setShowPayment(!showPayment)}
              className="p-2 bg-white rounded-full hover:bg-[#FD915A] transition-all duration-300 ease-in-out group"
            >
              <img
                src={`/assets/img/arrow-${showPayment ? "up" : "down"}.png`}
                alt="button-down"
                className="group-hover:filster group-hover:invert group-hover:brightness-0 transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          {/* RENDER DETAIL PAYMENT */}
          {isLoading ? (
            <>
              <h1 className="text-center font-semibold italic">Loading Data ....</h1>
            </>
          ) : (
            showPayment && (
              <div className="mt-[10px] px-5 py-7 bg-white rounded-[24px] flex flex-col gap-y-5">
                <DetailPayment billing={transaction?.billing} />
              </div>
            )
          )}
        </div>

        {/* Payment Method */}
        <div className="mt-[30px] px-[16px]">
          <div>
            <h1 className="font-bold text-xl">Payment Method</h1>

            {/* Description Payment */}
            <div className="mt-[12px] p-5 bg-white rounded-[24px]">
              {/* Transfer Method */}
              {isLoading ? (
                <>
                  <h1 className="text-center font-semibold italic">Loading Data ....</h1>
                </>
              ) : (
                transaction?.billing?.payment_method && (
                  <div>
                    <h1 className="font-bold tracking-wider">{transaction?.billing?.payment_method}</h1>
                    <div className="flex flex-col gap-y-3 mt-5">
                      <div className="flex items-center gap-x-3">
                        <img src="/assets/img/bank.png" alt="bank" />
                        <h1 className="font-semibold">
                          {transaction?.billing?.payment_method === "TRANSFER" ? "Bank Pharmakey Healty" : "take a photo when the medicine arrives."}
                        </h1>
                      </div>

                      {transaction?.billing?.payment_method === "TRANSFER" && (
                        <div className="flex items-center gap-x-3">
                          <img src="/assets/img/card-payment.png" alt="card-payment" />
                          <h1 className="font-semibold">0812931283123</h1>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* SHIPPING */}
        <div className="mt-[30px] pb-[50px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Delivery to</h1>
          </div>

          {/* Data User */}
          {isLoading ? (
            <>
              <h1 className="text-center font-semibold italic">Loading Data ....</h1>
            </>
          ) : (
            <div className="p-5 bg-white rounded-[24px] mt-[10px]">
              <div className="flex flex-col gap-y-3">
                {/* Address */}
                <div className="flex flex-col gap-y-2">
                  <h1 className="font-bold tracking-wide text-lg">Address</h1>
                  <div className="flex gap-x-2 items-center">
                    <img src="/assets/img/location.png" alt="location" className="size-5" />
                    <p className="font-semibold text-slate-500 tracking-wide">{transaction?.shipping?.address}</p>
                  </div>
                </div>

                {/* City */}
                <div className="flex flex-col gap-y-2">
                  <h1 className="font-bold tracking-wide text-lg">City</h1>
                  <div className="flex gap-x-2 items-center">
                    <img src="/assets/img/city.png" alt="city" className="size-5" />
                    <p className="font-semibold text-slate-500 tracking-wide">{transaction?.shipping?.city}</p>
                  </div>
                </div>

                {/* Post Code */}
                <div className="flex flex-col gap-y-2">
                  <h1 className="font-bold tracking-wide text-lg">Post Code</h1>
                  <div className="flex gap-x-2 items-center">
                    <img src="/assets/img/house.png" alt="post_code" className="size-5" />
                    <p className="font-semibold text-slate-500 tracking-wide">{transaction?.shipping?.post_code}</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-y-2">
                  <h1 className="font-bold tracking-wide text-lg">Phone Number</h1>
                  <div className="flex gap-x-2 items-center">
                    <img src="/assets/img/call.png" alt="phone_number" className="size-5" />
                    <p className="font-semibold text-slate-500 tracking-wide">{transaction?.shipping?.phone_number}</p>
                  </div>
                </div>

                {/* Note */}
                <div className="flex flex-col gap-y-2">
                  <h1 className="font-bold tracking-wide text-lg">Note</h1>
                  <div className="flex gap-x-2 items-center">
                    <img src="/assets/img/note.png" alt="note" className="size-5" />
                    <p className="font-semibold text-slate-500 tracking-wide">{transaction?.notes || "Customer didn't add note"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price Total & SEND PROOF */}
        <div className="pb-[50px] px-[16px]">
          <div className="flex items-center justify-between p-5 bg-black rounded-[23px]">
            <div className="flex flex-col items-start gap-y-4">
              <div>
                <p className="text-gray-300 text-sm font-semibold">Grand Total</p>
                <h1 className="text-2xl text-white font-bold">{convertToRp(transaction?.billing?.total_amount)}</h1>
              </div>
              <p className="text-white text-sm font-semibold tracking-wider">{moment(transaction?.created_at).format("HH:mm - DD/MM/YYYY")}</p>
            </div>

            {/* Upload PROOF */}
            {transaction?.proof === null && transaction?.is_paid === "PENDING" && (
              <div>
                {transaction.id === proofImage.transactionId && proofImage.proof !== null ? (
                  <div className="flex flex-col items-center gap-y-1">
                    <button
                      onClick={handleSendProof}
                      className="cursor-pointer tracking-wider px-5 py-2 bg-sky-500 text-white font-bold rounded-[50px] hover:bg-white hover:text-sky-500 hover:ring-2 hover:ring-sky-500 duration-300"
                    >
                      Send Proof
                    </button>
                    <p className="text-white font-semibold italic">Proof Uploaded</p>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor={transaction.id}
                      className="cursor-pointer tracking-wider px-6 py-3 bg-[#FD915A] text-white font-bold rounded-[50px] hover:bg-white hover:text-[#FD915A] hover:ring-2 hover:ring-[#FD915A] duration-300"
                    >
                      Upload Proof
                    </label>
                    <input hidden type="file" accept="image/*" name="proof" id={transaction.id} onChange={handleUploadProof} />
                  </div>
                )}
              </div>
            )}

            {/* Awaiting Approval */}
            {transaction?.proof !== null && transaction?.is_paid === "PENDING" && (
              <p className=" tracking-wider px-6 py-3 bg-gray-500 text-white font-bold rounded-[50px]">Awaiting Approval ...</p>
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
  );
}
