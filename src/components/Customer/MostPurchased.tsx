/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { useProducts } from "../../pages/CustomHooks/useProduct";
import { getImageUrl } from "../../utils/getImageUrl";

export const MostPurchased = () => {
  const { products, isLoading } = useProducts({ limit: 4 });

  const RenderMostPurchasedProduct = () => {
    // NOT FOUND
    if (!products || products?.length == 0) {
      return <p className="font-semibold ml-1 tracking-wider text-slate-500">Products not found</p>;
    }

    return products?.map((product) => {
      const productImage = getImageUrl("products", product.product_image);
      return (
        <Link
          to={`/detail-product/${product.slug}/${product.id}`}
          key={product.id}
          className="flex items-center justify-between gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:bg-[#FD915A] transition-all duration-300 ease-in-out group"
        >
          {/* Products */}
          <div className="flex items-center  gap-x-3">
            <img src={productImage} alt="product-image" className="w-[70px] h-[70px] object-contain" />
            <div className="flex flex-col gap-y-1 items-start">
              <h1 className="font-bold group-hover:text-white text-start whitespace-normal">{product.name}</h1>
              <p className="font-semibold text-slate-400 group-hover:text-white">Rp. {product.price.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* 5 Star */}
          <div>
            <img src="assets/img/star.png" alt="star" className="group-hover:filter group-hover:brightness-0 group-hover:invert" />
          </div>
        </Link>
      );
    });
  };

  return (
    <>
      <div className="pt-[30px] pb-[150px] px-[16px]">
        <h1 className="text-[22px] font-bold">Most Purchased</h1>

        <div className="mt-[10px] flex flex-col gap-y-5 overflow-x-auto scrollbar-hide">
          {isLoading ? <p className="font-semibold ml-1 tracking-wider text-slate-500">Loading Products ...</p> : <RenderMostPurchasedProduct />}
        </div>
      </div>
    </>
  );
};
