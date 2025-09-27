/* eslint-disable react-hooks/exhaustive-deps */
import { Product } from "../../types/product.type";
import { CardProduct } from "./CardProduct";

export const LatestProducts = ({ products, isLoading }: { products?: Product[]; isLoading: boolean }) => {
  return (
    <>
      <div className="mt-[10px] px-[16px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold">Latest Products</h1>
          <div className="flex items-center gap-x-1 mr-3">
            <p className="text-xs text-slate-400 font-semibold">swipe</p>
            <img src="assets/img/arrow-right.png" alt="swipe" className="w-[15px] h-[15px] mt-1" />
          </div>
        </div>

        <div className="px-2 py-5 flex items-center gap-x-5 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {/* Card Categories */}
          {isLoading ? <p className="font-semibold ml-1 tracking-wider text-slate-500">Loading Products ...</p> : <CardProduct products={products} />}
        </div>
      </div>
    </>
  );
};
