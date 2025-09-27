import { Product } from "../../types/product.type";
import { Link } from "react-router-dom";
import { convertToRp } from "../../utils/convertToRp";

export const CardProduct = ({ products }: { products?: Product[] }) => {
  // NOT FOUND
  if (!products || products?.length == 0) {
    return <p className="font-semibold ml-1 tracking-wider text-slate-500">Products not found</p>;
  }

  return products?.map((product) => {
    return (
      <Link
        to={`/detail-product/${product.slug}`}
        key={product.id}
        className="py-5 px-4 bg-white border border-slate-200 rounded-[16px] shrink-0 shadow-lg shadow-gray-300 hover:bg-primary transition-all duration-300 ease-in-out group"
      >
        {/* Card Products */}
        <div className="grid grid-cols-1 place-items-center place-content-center h-full gap-y-2">
          {/* Image */}
          <img src={product.image_url || "/assets/img/no-image.png"} alt="product-image" className="size-24 object-contain" />

          {/* Wrapper name & price */}
          <div className="h-full w-full flex flex-col items-center justify-between gap-y-1">
            {/* Name */}
            <h1 className="font-bold group-hover:text-white text-center whitespace-normal">{product.name}</h1>
            {/* Price */}
            <p className="font-semibold text-slate-400 group-hover:text-white">{convertToRp(product?.price)}</p>
          </div>
        </div>
      </Link>
    );
  });
};
