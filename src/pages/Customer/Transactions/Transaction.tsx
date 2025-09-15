/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../../../components/Customer/Navbar";
import { useTransaction } from "../../CustomHooks/useTransaction";
import { useAuth } from "../../../Auth/useAuth";
import { useState } from "react";
import moment from "moment";
import { CustomAlert } from "../../../utils/CustomAlert";
import { convertToRp } from "../../../utils/convertToRp";

interface Proof {
  transactionId: string;
  proof: File | null;
}

export default function Transactions() {
  const { user } = useAuth();
  const { transactions, isLoading, sendProof } = useTransaction({ customerId: user?.userId });
  const navigate = useNavigate();

  const RenderTransactions = () => {
    const [proofImage, setProofImage] = useState<Proof>({
      transactionId: "",
      proof: null,
    });

    return transactions?.map((transaction, index) => {
      const isLastData: boolean = transactions?.length > 0 ? index === transactions?.length - 1 : false;

      const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProofImage({
          transactionId: transaction.id,
          proof: e.target.files?.[0] || null,
        });

        CustomAlert("Success", "success", "Proof Uploaded.");
      };

      const handleSendProof = async () => {
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

      return (
        <div key={index} className="relative flex flex-col items-start bg-white p-5 rounded-xl shadow-lg shadow-gray-300 border border-slate-200">
          {/* Detail Text */}
          <div className="flex items-center justify-between w-full">
            {/* Total Price */}
            <div>
              <h1 className="font-semibold tracking-wide text-sm text-slate-500">Total Price</h1>
              <p className="font-bold text-slate-600">{convertToRp(transaction?.billing?.total_amount)}</p>
            </div>

            {/* Date */}
            <div>
              <h1 className="font-semibold tracking-wide text-sm text-slate-500">Date</h1>
              <p className="font-bold text-slate-600">{moment(transaction.created_at).format("HH:mm - DD/MM/YYYY")}</p>
            </div>

            {/* Status */}
            <div>
              <h1 className="font-semibold tracking-wide text-sm text-slate-500 flex flex-col justify-center items-center">Status</h1>
              <p
                className={`px-2 py-1 text-white font-semibold rounded-lg text-center uppercase text-[13px] tracking-wide ${
                  transaction.is_paid === "PENDING" ? "bg-yellow-500" : transaction.is_paid === "SUCCESS" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {transaction.is_paid}
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="flex items-center gap-x-3 w-full mt-5">
            {/* Detail */}
            <Link
              to={`/detail-transaction/${transaction.id}`}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-gray-300 hover:text-blue-500 hover:bg-white hover:outline-none hover:ring-2 hover:ring-blue-500 duration-300"
            >
              Detail
            </Link>

            {/* SEND Proof Button */}
            {transaction.proof === null && transaction.is_paid === "PENDING" && (
              <div>
                {proofImage.transactionId === transaction.id && proofImage.proof !== null ? (
                  <div className="flex items-center gap-x-2">
                    <button
                      onClick={handleSendProof}
                      className="cursor-pointer px-3 py-1 bg-sky-500 text-white rounded-lg font-semibold shadow-lg shadow-gray-300 hover:text-sky-500 hover:bg-white hover:outline-none hover:ring-2 hover:ring-sky-500 duration-300"
                    >
                      Send Proof
                    </button>
                    <p className="font-semibold text-green-600 italic">Proof Uploaded</p>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor={transaction.id}
                      className="cursor-pointer px-3 py-1 bg-[#FD915A] text-white rounded-lg font-semibold shadow-lg shadow-gray-300 hover:text-[#FD915A] hover:bg-white hover:outline-none hover:ring-2 hover:ring-[#FD915A] duration-300"
                    >
                      Upload Proof
                    </label>
                    <input type="file" name="proof" id={transaction.id} className="hidden" accept="image/*" onChange={handleUploadProof} />
                  </div>
                )}
              </div>
            )}

            {/* Awaiting Approval */}
            {transaction.proof !== null && transaction.is_paid === "PENDING" && <p className="text-gray-600 font-semibold">Awaiting Approval ...</p>}

            {/* SUCCESS */}
            {transaction.proof !== null && transaction.is_paid === "SUCCESS" && <p className="text-green-600 font-semibold">Proof Accepted</p>}

            {/* CANCELLED */}
            {transaction.is_paid === "CANCELLED" && <p className="text-red-500 font-semibold">Cancelled</p>}
          </div>

          {isLastData && (
            <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full text-center font-semibold text-slate-400">
              Your have reached the last Transactions
            </p>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <section>
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          {/* Button Back */}
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group"
          >
            <img src="assets/img/arrow-left.png" alt="back-button" className="group-hover:filter group-hover:invert group-hover:brightness-0" />
          </button>
          {/* Tiitle */}
          <h1 className="font-semibold text-xl absolute left-1/2 -translate-x-[50%]">Transactions</h1>
        </div>

        {/* Result Store */}
        <div className="mt-[30px] px-[16px]">
          <h1 className="font-bold tracking-wider">Your Transactions</h1>

          {/* Store */}
          <div className="mt-[10px] pb-[180px] flex flex-col gap-y-5 min-h-dvh">
            {isLoading ? (
              <div>Loading Data Transactions ....</div>
            ) : transactions?.length !== 0 ? (
              <RenderTransactions />
            ) : (
              <p>You dont have any Transactions</p>
            )}
          </div>
        </div>

        {/* Navbar */}
        <Navbar />
      </section>
    </>
  );
}
