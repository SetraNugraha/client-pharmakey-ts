/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { InputField } from "../../components/Customer/InputField"
import { useCart } from "../CustomHooks/useCart"
import { CustomAlert, CustomAlertConfirm } from "../../utils/CustomAlert"
import { useCustomer } from "../CustomHooks/useCustomer"
import { useAuth } from "../../Auth/useAuth"
import { Transaction } from "../../types"
import { useTransaction } from "../CustomHooks/useTransaction"
// import { motion, AnimatePresence } from "framer-motion"
import { ExpandTransition } from "../../utils/ExpandTransition"

type PaymentMethod = "TRANSFER" | "COD"
type DetailPayment = {
  subTotal: number
  tax: number
  deliveryFee: number
  grandTotal: number
}

type DeliveryTo = {
  address: string
  city: string
  post_code: number
  phone_number: string
}

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { customerCarts, cartAction, getCustomerCart } = useCart()
  const { getCustomerById } = useCustomer()
  const { checkout, hasErrors } = useTransaction()
  const [showItems, setShowItems] = useState<boolean>(true)
  const [showPayment, setShowPayment] = useState<boolean>(true)

  const [currCustomerAddress, setCurrCustomerAddress] = useState<DeliveryTo>({
    address: "",
    city: "",
    post_code: Number(""),
    phone_number: "",
  })

  const [detailPayment, setDetailPayment] = useState<DetailPayment>({
    subTotal: 0,
    tax: 0,
    deliveryFee: 0,
    grandTotal: 0,
  })

  const [formCheckout, setFormCheckout] = useState<Partial<Transaction>>({})

  // GET Current Customer Address
  useEffect(() => {
    const userId = user?.userId ? user?.userId : null

    const fetchCustomer = async () => {
      const customer = await getCustomerById(userId)
      setCurrCustomerAddress((prevState) => ({
        ...prevState,
        address: customer?.data.address,
        city: customer?.data.city,
        post_code: customer?.data.post_code,
        phone_number: customer?.data.phone_number,
      }))
    }

    fetchCustomer()
  }, [user?.userId])

  // Payment Detail
  useEffect(() => {
    const subTotal = customerCarts.reduce(
      (total, cart) => total + cart.product.price * cart.quantity,
      0
    )
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
  }, [customerCarts])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement

    setFormCheckout((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSelectedMethod = (method: PaymentMethod) => {
    setFormCheckout((prevState) => ({
      ...prevState,
      payment_method: method,
    }))
  }

  const handleCheckout = async () => {
    const isConfirm = await CustomAlertConfirm(
      "Are you sure want to checkout ?"
    )

    if (isConfirm) {
      const checkoutResult = await checkout(formCheckout)
      if (checkoutResult?.success) {
        navigate("/finish-checkout")
        setFormCheckout({})
        CustomAlert("Success", "success", checkoutResult.message)
      } else {
        if (checkoutResult?.message) {
          CustomAlert("Checkout Failed", "warning", checkoutResult.message)
        }
      }
    }
  }

  const RenderItems = () => {
    if (customerCarts.length === 0) {
      return <p className="font-semibold tracking-wider p-2 ">Cart is empty</p>
    }

    const deleteItemFromCart = async (productId?: number) => {
      if (!productId) {
        console.error("error remove item from cart: invalid product id")
        return
      }

      const result = await cartAction(productId, "delete")

      if (result?.success) {
        CustomAlert("Success", "success", result?.message)
        await getCustomerCart()
      } else {
        CustomAlert("Error", "error", result?.message)
      }
    }

    return customerCarts.map((cart, index) => {
      const productImage = cart.product?.product_image
        ? `${import.meta.env.VITE_IMAGE_URL}/products/${
            cart.product.product_image
          }`
        : "/assets/img/no-image.png"
      return (
        <div key={index} className="relative">
          {/* Products */}
          <Link
            to={`/detail-product/${cart.product.slug}/${cart.product.id}`}
            className="flex items-center justify-between gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:bg-[#FD915A] group"
          >
            <div className="flex items-center  gap-x-3">
              <img
                src={productImage}
                alt="product-image"
                className="size-16 object-contain"
              />
              <div className="flex flex-col gap-y-1 items-start">
                <h1 className="font-bold group-hover:text-white text-start">
                  {cart.product.name}
                </h1>
                <p className="font-semibold text-slate-400 group-hover:text-white">
                  Rp. {cart.product.price.toLocaleString("id-ID") || ""}
                </p>
                <p className="font-semibold text-sm text-slate-400 group-hover:text-white">
                  Quantity: {cart.quantity}
                </p>
              </div>
            </div>
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => deleteItemFromCart(cart.product.id)}
            className="absolute top-1/2 -translate-y-1/2 right-5 p-2 bg-red-500 rounded-full hover:bg-slate-400 transition-all duration-200 ease-in-out"
          >
            <img src="assets/img/trash.png" alt="trash-icon" />
          </button>
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
          <p className="font-bold">
            Rp. {detailPayment.subTotal.toLocaleString("id-ID")}
          </p>
        </div>

        {/* PPN */}
        <div className="flex items-center justify-between">
          <h1>PPN 10%</h1>
          <p className="font-bold">
            Rp. {detailPayment.tax.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Delivery */}
        <div className="flex items-center justify-between">
          <h1>Delivery {"(Promo)"}</h1>
          <p className="font-bold">
            Rp. {detailPayment.deliveryFee.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between">
          <h1>Grand Total</h1>
          <p className="font-bold text-[#FD915A]">
            Rp. {detailPayment.grandTotal.toLocaleString("id-ID")}
          </p>
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
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group"
          >
            <img
              src="assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filster group-hover:invert group-hover:brightness-0"
            />
          </button>
          <h1 className="font-semibold text-xl">Shopping Cart</h1>
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
                src={`assets/img/arrow-${showItems ? "up" : "down"}.png`}
                alt="button-down"
                className="group-hover:filster group-hover:invert group-hover:brightness-0 transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          {/* RENDER ITEMS */}
          <ExpandTransition
            isActive={showItems}
            className="mt-[10px] flex flex-col gap-y-3 origin-top"
          >
            <RenderItems />
          </ExpandTransition>
        </div>

        {/* Details Payment */}
        <div className="mt-[30px] px-[16px]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Detail Payment</h1>
            <button
              onClick={() => setShowPayment(!showPayment)}
              className="p-2 bg-white rounded-full hover:bg-[#FD915A] transition-all duration-300 ease-in-out group"
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
            <RenderDetailPayment />
          </ExpandTransition>
        </div>

        {/* Payment Method */}
        <div className="mt-[30px] px-[16px]">
          <div>
            <h1 className="font-bold text-xl">Payment Method</h1>

            {/* Button */}
            <div className="flex items-center justify-between mt-[10px] gap-4">
              <button
                onClick={() => handleSelectedMethod("TRANSFER")}
                className={`w-1/2 flex items-center gap-x-3 py-3 px-7 bg-white rounded-[16px] hover:outline-none hover:ring-1 hover:ring-[#F39D84] ${
                  formCheckout.payment_method === "TRANSFER"
                    ? "border-[2px] border-[#F39D84]"
                    : ""
                }`}
              >
                <img
                  src="assets/img/transfer.png"
                  alt="transfer"
                  className="p-2 bg-[#98B1FC] rounded-full"
                />
                <p className="font-semibold">Transfer</p>
              </button>

              <button
                onClick={() => handleSelectedMethod("COD")}
                className={`w-1/2 flex items-center gap-x-3 py-3 px-7 bg-white rounded-[16px] hover:outline-none hover:ring-1 hover:ring-[#F39D84] ${
                  formCheckout.payment_method === "COD"
                    ? "border-[2px] border-[#F39D84]"
                    : ""
                }`}
              >
                <img
                  src="assets/img/cod.png"
                  alt="cod"
                  className="p-2 bg-[#F39D84] rounded-full"
                />
                <p className="font-semibold">COD</p>
              </button>
            </div>

            {/* Description Payment */}
            <div className="mt-[12px] p-5 bg-white rounded-[24px]">
              {/* Null */}
              {!formCheckout.payment_method && (
                <div>
                  <h1 className="font-semibold text-center">
                    Please select a payment method
                  </h1>
                </div>
              )}

              {/* Transfer Method */}
              {formCheckout.payment_method === "TRANSFER" && (
                <div>
                  <h1 className="font-bold">Transfer to</h1>
                  <div className="flex flex-col gap-y-3 mt-5">
                    <div className="flex items-center gap-x-3">
                      <img src="assets/img/bank.png" alt="bank" />
                      <h1 className="font-semibold">Bank Pharmakey Healty</h1>
                    </div>

                    <div className="flex items-center gap-x-3">
                      <img
                        src="assets/img/card-payment.png"
                        alt="card-payment"
                      />
                      <h1 className="font-semibold">0812931283123</h1>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Method */}
              {formCheckout.payment_method === "COD" && (
                <div>
                  <h1 className="font-bold">COD Method</h1>
                  <div className="flex flex-col gap-y-3 mt-5">
                    <div className="flex items-center gap-x-3">
                      <img src="assets/img/bank.png" alt="bank" />
                      <h1 className="font-semibold">
                        take a photo when the medicine arrives.
                      </h1>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
              <form action="" className="flex flex-col gap-y-5">
                <InputField
                  label="Address"
                  name="address"
                  type="text"
                  placeholder="address"
                  icon="assets/img/location.png"
                  value={
                    formCheckout.address ?? currCustomerAddress.address ?? ""
                  }
                  onChange={handleChange}
                />

                <InputField
                  label="City"
                  name="city"
                  type="text"
                  placeholder="City"
                  icon="assets/img/city.png"
                  value={formCheckout.city ?? currCustomerAddress.city ?? ""}
                  onChange={handleChange}
                />

                <InputField
                  label="Post Code"
                  name="post_code"
                  type="number"
                  placeholder="Post Code"
                  icon="assets/img/house.png"
                  isError={hasErrors?.path === "post_code"}
                  value={
                    formCheckout.post_code ??
                    currCustomerAddress.post_code ??
                    ""
                  }
                  onChange={handleChange}
                />

                {hasErrors && hasErrors.path === "post_code" && (
                  <p className="ml-3 -mt-3 font-semibold text-red-500 tracking-wider">
                    {hasErrors.message}
                  </p>
                )}

                <InputField
                  label="Phone Number"
                  name="phone_number"
                  type="number"
                  placeholder="Phone Number"
                  icon="assets/img/call.png"
                  value={
                    formCheckout.phone_number ??
                    currCustomerAddress.phone_number ??
                    ""
                  }
                  onChange={handleChange}
                />

                <div className="relative">
                  <label htmlFor="note" className="font-semibold">
                    Add. Note
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    placeholder="Add Note"
                    className="w-full h-full px-12 py-3 mt-2 border border-slate-300 rounded-2xl placeholder:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FD915A]"
                    value={formCheckout.notes ?? ""}
                    onChange={handleChange}
                  ></textarea>
                  <img
                    src="assets/img/note.png"
                    alt="note"
                    className="absolute top-[47px] left-[15px]"
                  />
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
              <h1 className="text-2xl text-white font-bold">
                Rp. {detailPayment.grandTotal.toLocaleString("id-ID")}
              </h1>
            </div>

            <button
              onClick={handleCheckout}
              className="tracking-wider px-6 py-3 bg-[#FD915A] text-white font-bold rounded-[50px] hover:bg-white hover:text-[#FD915A] hover:ring-2 hover:ring-[#FD915A]"
            >
              Checkout
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
