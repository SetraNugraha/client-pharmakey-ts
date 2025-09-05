import { Billing } from "../../../types/transaction.type";

export const DetailPayment = ({ billing }: { billing: Billing }) => {
  return (
    <>
      {/* Sub Total */}
      <div className="flex items-center justify-between">
        <h1>Sub Total</h1>
        <p className="font-bold">Rp. {billing.sub_total.toLocaleString("id-ID")}</p>
      </div>

      {/* PPN */}
      <div className="flex items-center justify-between">
        <h1>PPN 10%</h1>
        <p className="font-bold">Rp. {billing.tax.toLocaleString("id-ID")}</p>
      </div>

      {/* Delivery */}
      <div className="flex items-center justify-between">
        <h1>Delivery {"(Promo)"}</h1>
        <p className="font-bold">Rp. {billing.delivery_fee.toLocaleString("id-ID")}</p>
      </div>

      {/* Grand Total */}
      <div className="flex items-center justify-between">
        <h1>Grand Total</h1>
        <p className="font-bold text-[#FD915A]">Rp. {billing.total_amount.toLocaleString("id-ID")}</p>
      </div>
    </>
  );
};
