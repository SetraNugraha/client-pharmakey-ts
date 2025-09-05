/* eslint-disable react-hooks/exhaustive-deps */
import Modal from "../../../components/Admin/Modal";
import moment from "moment";
import { CustomAlertConfirm, CustomAlert } from "../../../utils/CustomAlert";
import { Transaction, UpdateIsPaid } from "../../../types/transaction.type";
import { getImageUrl } from "../../../utils/getImageUrl";
import { IsPaid } from "../../../types/transaction.type";
import { toRupiah } from "../../../utils/convertToRp";
import { useTransaction } from "../../CustomHooks/useTransaction";
import { AxiosError } from "axios";

type ModalTransactionDetailProps = {
  transaction: Transaction | null;
  onClose: () => void;
};

export default function ModalTransactionDetail({ transaction, onClose }: ModalTransactionDetailProps) {
  const { updateStatusIsPaid } = useTransaction({});

  const RenderDataTransaction = () => {
    if (!transaction) return;
    const proofImage = getImageUrl("proofTransactions", transaction.proof);

    const paidStatusColor: Record<IsPaid, string> = {
      [IsPaid.PENDING]: "bg-yellow-600",
      [IsPaid.SUCCESS]: "bg-green-600",
      [IsPaid.CANCELLED]: "bg-red-600",
    };

    const handleUpdateIsPaid = async (status: UpdateIsPaid) => {
      const title =
        status === UpdateIsPaid.SUCCESS
          ? "Are you sure want to APPROVE this Transaction ?"
          : "Are you sure want to CANCEL this Transaction";

      const isConfirm = await CustomAlertConfirm(title);

      if (isConfirm) {
        updateStatusIsPaid.mutate(
          { transactionId: transaction.id, newStatus: status },
          {
            onSuccess: (data) => {
              CustomAlert("success", "success", data.message);
              onClose();
            },
            onError: (error) => {
              console.log("handleUpdateIsPaid Error: ", error);
              if (error instanceof AxiosError) {
                CustomAlert("error", "error", error.response?.data.message);
              } else {
                CustomAlert("error", "error", "internal server error, please try again later.");
              }
            },
          }
        );
      } else {
        CustomAlert("cancelled", "error", "Cancelled to update status transaction");
      }
    };

    return (
      <div className="w-[900px]">
        {/* Header */}
        <div className="relative flex items-center justify-between pb-5">
          {/* Email */}
          <div>
            <h1 className="text-slate-400 font-semibold">Email</h1>
            <p className="font-bold text-md">{transaction.customer.email}</p>
          </div>

          {/* Payment Method */}
          <div>
            <h1 className="text-slate-400 font-semibold">Payment</h1>
            <p className="font-bold text-md tracking-wider">{transaction.billing.payment_method}</p>
          </div>

          {/* Total Transaction */}
          <div>
            <h1 className="text-slate-400 font-semibold">Total Transaction</h1>
            <p className="font-bold text-md tracking-wider">{toRupiah(transaction.billing.total_amount)}</p>
          </div>

          {/* Date */}
          <div>
            <h1 className="text-slate-400 font-semibold">Date</h1>
            <p className="font-bold text-md">{moment(transaction.created_at).format("HH:mm - DD/MM/YYYY")}</p>
          </div>

          {/* Status */}
          <div>
            <p
              className={`my-3 p-2 tracking-wider text-white font-semibold inline-block rounded-lg uppercase ${
                paidStatusColor[transaction.is_paid]
              }`}
            >
              {transaction.is_paid}
            </p>
          </div>

          {/* Horizontal line */}
          <div className="absolute bottom-0 h-[2px] w-full border border-slate-300 opacity-50"></div>
        </div>

        <div className="flex items-start justify-between gap-x-20 max-h-[520px] overflow-y-auto">
          {/* Container Left Content */}
          <div className="w-1/2">
            {/* List Product */}
            <h1 className="font-bold text-xl my-5 tracking-wide">List of Items</h1>
            <div className="py-3 rounded-lg flex flex-col gap-y-3 px-2 max-h-[300px] overflow-y-auto scrollbar-hide shadow-[inset_0_-8px_8px_-4px_rgba(0,0,0,0.1)]">
              {transaction.transaction_detail.map((item, index) => {
                const productImage = getImageUrl("products", item.product.product_image);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-x-5">
                      <img src={productImage} alt="product-image" className="w-[35px]" />
                      <div>
                        {/* Name */}
                        <h1 className="font-bold">{item.product.name}</h1>

                        {/* Price */}
                        <p className="font-semibold text-slate-400">{toRupiah(item.price)}</p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <p className="font-semibold text-slate-500">quantity : {item.quantity}</p>
                  </div>
                );
              })}
            </div>

            <div className="font-semibold mt-2 flex items-start justify-between">
              <h1>Total Item Purchase</h1>
              <p>{transaction.totalItemPurchase} Products</p>
            </div>

            {/* Price Details */}
            <div>
              <h1 className="font-bold text-xl my-5 tracking-wide">Billing Details</h1>
              <div className="flex flex-col gap-y-3">
                {/* Sub Total */}
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Sub Total Items</h1>
                  <p className="font-bold">{toRupiah(transaction.billing.sub_total)}</p>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Tax 10%</h1>
                  <p className="font-bold">{toRupiah(transaction.billing.tax)}</p>
                </div>

                {/* Delivery Fee */}
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Delivery Fee 5%</h1>
                  <p className="font-bold">{toRupiah(transaction.billing.delivery_fee)}</p>
                </div>

                {/* Grand Total */}
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Grand Total</h1>
                  <p className="font-bold">{toRupiah(transaction.billing.total_amount)}</p>
                </div>
              </div>
            </div>

            {/* Details of Delivery */}
            <div>
              <h1 className="font-bold text-xl my-5 tracking-wide">Shipping Details</h1>

              {/* Address */}
              <div className="flex flex-col gap-y-5">
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Address</h1>
                  <p className="font-bold">{transaction.shipping.address}</p>
                </div>

                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">City</h1>
                  <p className="font-bold">{transaction.shipping.city}r</p>
                </div>

                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Post Code</h1>
                  <p className="font-bold">{transaction.shipping.post_code}</p>
                </div>

                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-400">Phone Number</h1>
                  <p className="font-bold">{transaction.shipping.phone_number}</p>
                </div>
              </div>
              {/* Notes */}
              <div className="flex flex-col my-5">
                <h1 className="font-semibold text-slate-400">Note : </h1>
                <p className="font-bold">{transaction.notes !== null ? transaction.notes : "No notes found"}</p>
              </div>
            </div>
          </div>

          {/* Container Right Content */}
          <div className="w-1/2 pr-5">
            {/* Proof of Payment */}
            <h1 className="font-bold text-xl my-5 tracking-wide">Proof of Payment</h1>
            {transaction.proof !== null ? (
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
          {transaction.is_paid === IsPaid.PENDING && (
            <>
              {/* APPROVE */}
              <div className="absolute top-0 h-[2px] w-full border border-slate-300 opacity-50"></div>
              <button
                onClick={() => handleUpdateIsPaid(UpdateIsPaid.SUCCESS)}
                className="px-3 py-2 mt-5 bg-blue-500 text-white font-semibold rounded-lg tracking-wide shadow-xl hover:bg-white hover:text-blue-500 hover:outline-none hover:ring-2 hover:ring-blue-500 duration-300"
              >
                Approve
              </button>

              {/* CANCELLED */}
              <button
                onClick={() => handleUpdateIsPaid(UpdateIsPaid.CANCELLED)}
                className="px-3 py-2 mt-5 bg-red-500 text-white font-semibold rounded-lg tracking-wide shadow-xl hover:bg-white hover:text-red-500 hover:outline-none hover:ring-2 hover:ring-red-500 duration-300"
              >
                Cancel
              </button>
            </>
          )}

          {/* If SUCESS */}
          {transaction.is_paid === IsPaid.SUCCESS && (
            <>
              <div className="absolute top-0 h-[2px] w-full border border-slate-300 opacity-50"></div>
              <p className="flex flex-col mt-5 font-bold tracking-wider text-green-600">
                This transaction has been successfully completed,
                <span>on {moment(transaction.updated_at).format("DD-MM-YYYY")}</span>
              </p>
            </>
          )}

          {/*If CANCELLED */}
          {transaction.is_paid === IsPaid.CANCELLED && (
            <div>
              <div className="absolute top-0 h-[2px] w-full border border-slate-300 opacity-50"></div>
              <p className="flex flex-col mt-5 font-semibold tracking-widest text-red-600">
                This Transaction has been Cancelled,
                <span>on {moment(transaction.updated_at).format("DD-MM-YYYY")}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal>
        <Modal.Header title="Detail Transaction" onClose={onClose} />
        <Modal.Body>
          <RenderDataTransaction />
        </Modal.Body>
      </Modal>
    </>
  );
}
