/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../CustomHooks/useProduct";
import { CustomAlert } from "../../utils/CustomAlert";
import { useCart } from "../CustomHooks/useCart";
import { CartActionMethod } from "../../types/cart.type";
import { convertToRp } from "../../utils/convertToRp";
import React, { useState } from "react";
import { AxiosError } from "axios";
import { listGradingProduct } from "../../dummy-data/listGradingProduct";

export default function DetailProduct() {
  const { slug } = useParams();
  const { productBySlug, isLoadingProductBySlug } = useProducts({ slug: slug });
  const navigate = useNavigate();

  const RenderDetailProduct = () => {
    const { cartAction } = useCart();
    const [quantity, setQuantity] = useState<number>(1);

    const handleAddProduct = async (productId?: string) => {
      if (!productId) return;

      cartAction.mutate(
        { action: CartActionMethod.ADD, productId, quantity },
        {
          onSuccess: (data) => {
            CustomAlert("Success", "success", data?.message);
          },
          onError: (error: any) => {
            if (error instanceof AxiosError) {
              const err = error?.response?.data?.errors[0];
              if (err.field === "quantity") {
                CustomAlert("Error", "error", err.message);
                return;
              }
            }
            CustomAlert("Error", "error", error?.response?.data.message || "Error while removing item");
          },
        }
      );
    };

    const handleInputQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      setQuantity(Number(value));
    };

    return (
      <div className="pt-[55px] px-[24px]">
        <div className="flex flex-col justify-between gap-y-10">
          {/* Body */}
          <div>
            {/* Product Name */}
            <div className="flex flex-col gap-y-3">
              <div>
                <h1 className="font-bold text-2xl">{productBySlug?.name}</h1>
              </div>

              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                {/* Category */}
                <div className="flex items-center gap-x-2">
                  <img
                    src={productBySlug?.category?.image_url || "/assets/img/no-image.png"}
                    alt="category"
                    className="size-8 rounded-full object-contain"
                  />
                  <h1 className="font-semibold">{productBySlug?.category?.name || "unknown"}</h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-x-2">
                  <img src="/assets/img/1-star.png" alt="star" />
                  <h1 className="font-semibold">4.5/5</h1>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-[15px]">
              <p className=" text-slate-600">{productBySlug?.description || "No description"}</p>
            </div>

            {/* Grading */}
            <div className="mt-[20px] flex items-center gap-x-5 overflow-x-auto scrollbar-hide">
              {listGradingProduct.map((item, index) => (
                <div
                  key={index}
                  className="w-[100px] h-[100px] flex flex-col items-center justify-center gap-y-2 border border-slate-300 rounded-[16px] shrink-0"
                >
                  <img src={`/assets/img/${item.icon}.png`} alt="grade" />
                  <h1 className="font-semibold">{item.name}</h1>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="mt-[20px]">
              {/* text testimonial */}
              <p className="tracking-wider">My kid was happier whenever he is playing without artificial toys, full energy yeah!</p>
              <div className="mt-[10px] flex items-center justify-between">
                {/* user profile */}
                <div className="flex items-center gap-x-2">
                  <img src="/assets/img/user-profile.png" alt="user-profile" className="rounded-full" />
                  <p className="font-semibold">Jhon Doe</p>
                </div>
                {/* Rating */}
                <img src="/assets/img/star.png" alt="rating" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-y-3 w-full">
            {/* Display Price */}
            <div className="flex items-end gap-x-2">
              <h1 className="text-2xl font-bold">{convertToRp(productBySlug?.price)}</h1>
              <p className="text-slate-400">/quantity</p>
            </div>

            {/* Quantity & Buttion Cart */}
            <div className="flex items-end justify-between w-full mb-7">
              {/* Quantity Dynamic */}
              <div className="mt-2 h-full flex items-center gap-x-3">
                {/* BUTTON DECREMENT */}
                <button
                  className="px-2.5 rounded-lg bg-primary text-white font-bold text-lg hover:bg-white hover:text-primary transition-all duration-200 ease-in-out hover:ring-1 hover:ring-primary disabled:bg-slate-400 disabled:text-white disabled:hover:ring-0 disabled:cursor-not-allowed"
                  disabled={quantity === 0}
                  onClick={() => setQuantity((prev) => (prev === 0 ? prev : prev - 1))}
                >
                  -
                </button>
                {/* DISPLAY QUANTITY */}
                <input
                  type="text"
                  name="quantity"
                  id="quantity"
                  maxLength={4}
                  min={1}
                  className="ring-2 ring-slate-400 w-16 h-7 px-3 text-center rounded-lg font-semibold text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={quantity}
                  onChange={handleInputQuantity}
                />
                {/* BUTTON INCREAMENT */}
                <button
                  className="px-2 rounded-lg bg-primary text-white font-bold text-lg  transition-all duration-200 ease-in-out hover:outline-none hover:ring-1 hover:ring-primary hover:bg-white hover:text-primary"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              {/* Button Add To Cart */}
              <button
                onClick={() => handleAddProduct(productBySlug?.id)}
                className="px-6 py-2 -mb-1 bg-primary text-white text-sm font-bold rounded-xl hover:bg-white hover:text-primary transition-all duration-200 ease-in-out hover:outline-none hover:ring-2 hover:ring-primary"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="h-dvh">
        {/* Header */}
        <div className="relative py-[30px] px-[16px] flex items-center justify-between">
          {/* Button Back */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group"
          >
            <img src="/assets/img/arrow-left.png" alt="back-button" className="group-hover:filter group-hover:invert group-hover:brightness-0" />
          </button>

          {/* Title */}
          <h1 className="font-semibold text-xl absolute left-1/2 -translate-x-1/2">Details</h1>
        </div>

        {/* Product Image */}
        <div className="relative">
          {isLoadingProductBySlug ? (
            <p className="font-semibold text-center mt-5 tracking-wider text-slate-500">Loading Image ...</p>
          ) : (
            <img
              src={productBySlug?.image_url || "/assets/img/no-image.png"}
              alt="product-image"
              className="absolute left-1/2 -translate-x-1/2 size-64 xl:size-64 object-contain"
            />
          )}
        </div>

        {/* Render Detail */}
        <div className="bg-white border-t-2 border-slate-300 rounded-t-[60px] mt-[60%] lg:mt-[50%] xl:max-h-screen xl:pb-12">
          {isLoadingProductBySlug ? (
            <p className="font-semibold text-center ml-1 tracking-wider text-slate-500 bg-[#F7F1F0] -mt-5">Loading Products Detail...</p>
          ) : (
            <RenderDetailProduct />
          )}
        </div>
      </section>
    </>
  );
}
