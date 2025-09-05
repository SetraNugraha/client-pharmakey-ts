import { PaymentMethod } from "../../../types/transaction.type";

interface Props {
  payment_method?: PaymentMethod;
}

export const PaymentDisplay = ({ payment_method }: Props) => {
  return (
    <div className="mt-[12px] p-5 bg-white rounded-[24px]">
      {/* Null */}
      {payment_method === undefined && (
        <div>
          <h1 className="font-semibold text-center">Please select a payment method</h1>
        </div>
      )}

      {/* Transfer Method */}
      {payment_method === PaymentMethod.TRANSFER && (
        <div>
          <h1 className="font-bold">Transfer to</h1>
          <div className="flex flex-col gap-y-3 mt-5">
            <div className="flex items-center gap-x-3">
              <img src="assets/img/bank.png" alt="bank" />
              <h1 className="font-semibold">Bank Pharmakey Healty</h1>
            </div>

            <div className="flex items-center gap-x-3">
              <img src="assets/img/card-payment.png" alt="card-payment" />
              <h1 className="font-semibold">0812931283123</h1>
            </div>
          </div>
        </div>
      )}

      {/* Method COD */}
      {payment_method === PaymentMethod.COD && (
        <div>
          <h1 className="font-bold">COD Method</h1>
          <div className="flex flex-col gap-y-3 mt-5">
            <div className="flex items-center gap-x-3">
              <img src="assets/img/bank.png" alt="bank" />
              <h1 className="font-semibold">take a photo when the medicine arrives.</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
