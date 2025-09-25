import { Billing } from "../../../types/transaction.type";
import { convertToRp } from "../../../utils/convertToRp";

export const DetailPayment = ({ billing }: { billing?: Billing }) => {
  return (
    <>
      {/* Sub Total */}
      <div className="flex items-center justify-between">
        <h1>Sub Total</h1>
        <p className="font-bold">{convertToRp(billing?.sub_total)}</p>
      </div>

      {/* PPN */}
      <div className="flex items-center justify-between">
        <h1>PPN 10%</h1>
        <p className="font-bold">{convertToRp(billing?.tax)}</p>
      </div>

      {/* Delivery */}
      <div className="flex items-center justify-between">
        <h1>Delivery {"(Promo)"}</h1>
        <p className="font-bold">{convertToRp(billing?.delivery_fee)}</p>
      </div>

      {/* Grand Total */}
      <div className="flex items-center justify-between">
        <h1>Grand Total</h1>
        <p className="font-bold text-primary">{convertToRp(billing?.total_amount)}</p>
      </div>
    </>
  );
};
