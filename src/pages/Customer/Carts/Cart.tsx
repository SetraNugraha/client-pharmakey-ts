/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../../../components/Customer/InputField";
import { useCart } from "../../CustomHooks/useCart";
import { CustomAlert, CustomAlertConfirm } from "../../../utils/CustomAlert";
import { useCustomer } from "../../CustomHooks/useCustomer";
import { useAuth } from "../../../Auth/useAuth";
import { ExpandTransition } from "../../../utils/ExpandTransition";
import { Billing, PaymentMethod, ICheckout } from "../../../types/transaction.type";
import { Errors } from "../../../types/common.type";
import { AxiosError } from "axios";
import { DetailPayment } from "./DetailPayment";
import { CartItems } from "./CartItems";
import { getErrorField } from "../../../utils/getErrorField";
import { ButtonSelectPayment } from "../../../components/Customer/Carts/ButtonSelectPayment";
import { PaymentDisplay } from "../../../components/Customer/Carts/PaymentDisplay";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { authCustomer } = useCustomer(user?.userId);
  const { customerCarts, checkout } = useCart();
  const [showItems, setShowItems] = useState<boolean>(true);
  const [showPayment, setShowPayment] = useState<boolean>(true);

  const [checkoutError, setCheckoutError] = useState<Errors[]>([]);

  const [billing, setBilling] = useState<Billing>({
    sub_total: 0,
    tax: 0,
    delivery_fee: 0,
    total_amount: 0,
  });

  const [formCheckout, setFormCheckout] = useState<Partial<ICheckout>>({
    notes: null,
  });

  // Payment Detail
  useEffect(() => {
    if (!customerCarts) return;
    const sub_total = customerCarts.cart.reduce((total, cart) => total + cart.product.price * cart.quantity, 0);
    const tax = (10 / 100) * sub_total;
    const delivery_fee = (2 / 100) * sub_total;
    const total_amount = sub_total + tax + delivery_fee;

    setBilling((prevState) => ({
      ...prevState,
      sub_total,
      tax,
      delivery_fee,
      total_amount,
    }));
  }, [customerCarts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    let newValue: string | number | undefined = value;

    if (name === "post_code" || name === "phone_number") {
      newValue = value.replace(/\D/g, ""); // Only Number
    }

    setFormCheckout((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSelectedMethod = (method: PaymentMethod) => {
    setFormCheckout((prevState) => ({ ...prevState, payment_method: method }));
  };

  const handleCheckout = async () => {
    const isConfirm = await CustomAlertConfirm("Are you sure want to checkout ?");

    const payload = {
      ...formCheckout,
      address: formCheckout.address ?? authCustomer?.address ?? "",
      city: formCheckout.city ?? authCustomer?.city ?? "",
      post_code: formCheckout.post_code ?? authCustomer?.post_code ?? "",
      phone_number: formCheckout.phone_number ?? authCustomer?.phone_number ?? "",
    };

    if (isConfirm) {
      checkout.mutate(payload as ICheckout, {
        onSuccess: (data) => {
          setFormCheckout({});
          CustomAlert("Success", "success", data?.message);
          navigate("/finish-checkout");
        },
        onError: (error: any) => {
          if (error instanceof AxiosError) {
            const errors = error.response?.data.errors;
            // CART EMPTY
            if (!errors && !error.response?.data.success) {
              CustomAlert(error.response?.data.message, "error", "You need to purchase something before checkout.");
              return;
            }
            // PAYMENT METHOD
            if (getErrorField(errors, "payment_method")) {
              CustomAlert("Payment not complete", "error", "Please select payment method");
              return;
            }

            // VALIDATION ERROR
            if (errors && errors !== null && error.response?.data.message === "validation error") {
              setCheckoutError(errors);
            }
          } else {
            CustomAlert("Error", "error", "Internal server error, please try again later.");
            return;
          }
        },
      });
    }
  };

  return (
    <>
      <section className="">
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group"
          >
            <img src="assets/img/arrow-left.png" alt="back-button" className="group-hover:filster group-hover:invert group-hover:brightness-0" />
          </button>
          <h1 className="font-semibold text-xl">Shopping Cart</h1>
          <div></div>
        </div>

        {/* Items / Products */}
        <div className="mt-[30px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Cart Items</h1>
            <button
              onClick={() => setShowItems(!showItems)}
              className="p-2 bg-white rounded-full hover:bg-primary transition-all duration-300 ease-in-out group"
            >
              <img
                src={`assets/img/arrow-${showItems ? "up" : "down"}.png`}
                alt="button-down"
                className="group-hover:filster group-hover:invert group-hover:brightness-0 transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          {/* RENDER CART ITEMS */}
          <ExpandTransition isActive={showItems} className="mt-[10px] flex flex-col gap-y-3 origin-top overflow-auto max-h-[360px] rounded-lg pb-3">
            <CartItems carts={customerCarts?.cart} />
          </ExpandTransition>
        </div>

        {/* Details Payment */}
        <div className="mt-[30px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Detail Payment</h1>
            <button
              onClick={() => setShowPayment(!showPayment)}
              className="p-2 bg-white rounded-full hover:bg-primary transition-all duration-300 ease-in-out group"
            >
              <img
                src={`assets/img/arrow-${showPayment ? "up" : "down"}.png`}
                alt="button-down"
                className="group-hover:filster group-hover:invert group-hover:brightness-0 transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          {/* RENDER DETAIL PAYMENT */}
          <ExpandTransition
            isActive={showPayment}
            className="mt-[10px] px-5 py-7 bg-white rounded-[24px] flex flex-col gap-y-5 overflow-hidden origin-top"
          >
            <DetailPayment billing={billing} />
          </ExpandTransition>
        </div>

        {/* Payment Method */}
        <div className="mt-[30px] px-[16px]">
          <div>
            <h1 className="font-bold text-xl">Payment Method</h1>

            {/* Button */}
            <div className="flex items-center justify-between mt-[10px] gap-4">
              <ButtonSelectPayment
                icon="transfer"
                title="TRANSFER"
                isSelected={formCheckout.payment_method === PaymentMethod.TRANSFER}
                handleSelectedMethod={() => handleSelectedMethod(PaymentMethod.TRANSFER)}
              />

              <ButtonSelectPayment
                icon="cod"
                title="COD"
                isSelected={formCheckout.payment_method === PaymentMethod.COD}
                handleSelectedMethod={() => handleSelectedMethod(PaymentMethod.COD)}
              />
            </div>

            {/* Description Payment */}
            <PaymentDisplay payment_method={formCheckout.payment_method} />
          </div>
        </div>

        {/* Delivery */}
        <div className="mt-[30px] pb-[30px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Delivery to</h1>
          </div>

          {/* Data User */}
          <div className="p-5 bg-white rounded-[24px] mt-[10px]">
            <div>
              <form className="flex flex-col gap-y-5">
                {/* ADDRESS */}
                <InputField
                  label="Address"
                  name="address"
                  type="text"
                  placeholder="address"
                  icon="assets/img/location.png"
                  isError={!!getErrorField(checkoutError, "address")}
                  value={formCheckout.address ?? authCustomer?.address ?? ""}
                  onChange={handleChange}
                />

                {getErrorField(checkoutError, "address") && (
                  <p className="ml-3 -mt-3 font-semibold text-red-500 tracking-wider"> {getErrorField(checkoutError, "address")?.message}</p>
                )}

                {/* CITY */}
                <InputField
                  label="City"
                  name="city"
                  type="text"
                  placeholder="City"
                  icon="assets/img/city.png"
                  isError={!!getErrorField(checkoutError, "city")}
                  value={formCheckout.city ?? authCustomer?.city ?? ""}
                  onChange={handleChange}
                />

                {getErrorField(checkoutError, "city") && (
                  <p className="ml-3 -mt-3 font-semibold text-red-500 tracking-wider"> {getErrorField(checkoutError, "city")?.message}</p>
                )}

                {/* POST CODE */}
                <InputField
                  label="Post Code"
                  name="post_code"
                  type="text"
                  placeholder="Post Code"
                  icon="assets/img/house.png"
                  inputMode={"numeric"}
                  pattern="[0-9]*"
                  maxLength={5}
                  isError={!!getErrorField(checkoutError, "post_code")}
                  value={formCheckout.post_code ?? authCustomer?.post_code ?? ""}
                  onChange={handleChange}
                />

                {getErrorField(checkoutError, "post_code") && (
                  <p className="ml-3 -mt-3 font-semibold text-red-500 tracking-wider">{getErrorField(checkoutError, "post_code")?.message}</p>
                )}

                {/* PHONE NUMBER */}
                <InputField
                  label="Phone Number"
                  name="phone_number"
                  type="text"
                  placeholder="Phone Number"
                  icon="assets/img/call.png"
                  inputMode={"numeric"}
                  pattern="[0-9]*"
                  maxLength={12}
                  isError={!!getErrorField(checkoutError, "phone_number")}
                  value={formCheckout.phone_number ?? authCustomer?.phone_number ?? ""}
                  onChange={handleChange}
                />

                {getErrorField(checkoutError, "phone_number") && (
                  <p className="ml-3 -mt-3 font-semibold text-red-500 tracking-wider">{getErrorField(checkoutError, "phone_number")?.message}</p>
                )}

                <div className="relative">
                  <label htmlFor="note" className="font-semibold">
                    Add. Note
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    placeholder="Add Note"
                    className="w-full h-full px-12 py-3 mt-2 border border-slate-300 rounded-2xl placeholder:text-[16px] focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formCheckout.notes || ""}
                    onChange={handleChange}
                  ></textarea>
                  <img src="assets/img/note.png" alt="note" className="absolute top-[47px] left-[15px]" />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Price Total */}
        <div className="pb-[30px] px-[16px]">
          <div className="flex items-center justify-between p-5 bg-black rounded-[23px]">
            <div>
              <p className="text-gray-300 text-xs font-semibold">Grand Total</p>
              <h1 className="text-2xl text-white font-bold">Rp. {billing.total_amount.toLocaleString("id-ID")}</h1>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkout.isPending}
              className="tracking-wider px-6 py-3 bg-primary text-white font-bold rounded-[50px] hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary disabled:bg-gray-500 disabled:ring-0 disabled:cursor-not-allowed"
            >
              {checkout.isPaused ? "Processing checkout ..." : "Checkout"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
