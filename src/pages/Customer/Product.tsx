/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { SearchInput } from "../../components/Customer/SearchInput";
import { Navbar } from "../../components/Customer/Navbar";
import { useProducts } from "../CustomHooks/useProduct";
import { getImageUrl } from "../../utils/getImageUrl";

export default function Product() {
  const { products, isLoading } = useProducts({});

  const RenderProducts = () => {
    return products?.map((product) => {
      const productImage = getImageUrl("products", product.product_image);
      return (
        <Link
          to={`/detail-product/${product.slug}/${product.id}`}
          key={product.id}
          className="py-5 px-4 bg-white border border-slate-200 rounded-[16px] shrink-0 shadow-lg shadow-gray-300 hover:bg-[#FD915A] transition-all duration-300 ease-in-out group"
        >
          {/* Card Products */}
          <div className="grid grid-cols-1 place-items-center place-content-center h-full gap-y-2">
            {/* Image */}
            <img src={productImage} alt="product-image" className="size-24 object-contain" />

            {/* Wrapper name & price */}
            <div className="h-full w-full flex flex-col items-center justify-between gap-y-1">
              {/* Name */}
              <h1 className="font-bold group-hover:text-white text-center whitespace-normal">{product.name}</h1>
              {/* Price */}
              <p className="font-semibold text-slate-400 group-hover:text-white">
                Rp. {product.price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </Link>
      );
    });
  };

  return (
    <>
      <section className="h-full flex flex-col min-h-screen pb-[150px]">
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          {/* Back Button */}
          <Link
            to="/"
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group"
          >
            <img
              src="assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filter group-hover:invert group-hover:brightness-0"
            />
          </Link>

          {/* Title */}
          <h1 className="font-semibold text-xl  absolute left-1/2 -translate-x-[50%]">Pharmakey Products</h1>
        </div>

        {/* Search Input  */}
        <div className="mt-[30px] px-[16px]">
          <SearchInput />
        </div>

        {/*  More Option */}
        <div className="mt-[30px] px-[16px]">
          <h1 className="font-bold">More Option</h1>

          <div className="text-white font-semibold flex items-center justify-between gap-x-3 mt-3 ">
            <Link
              to={"/doctors"}
              className="py-2 px-3 rounded-xl flex-grow bg-green-500 flex items-center justify-center gap-x-2 shadow-lg shadow-gray-300 hover:bg-[#FD915A] duration-300"
            >
              <img src="assets/img/doctor-white.svg" alt="doctor" className="text-white h-[30px]" />
              Consult with doctor
            </Link>
            <Link
              to={"/store"}
              className="py-2 px-3 rounded-xl flex-grow bg-yellow-500 flex items-center justify-center gap-x-2 shadow-lg shadow-gray-300 hover:bg-[#FD915A] duration-300"
            >
              <img src="assets/img/maps-white.svg" alt="maps" className="text-white h-[30px]" />
              Store location
            </Link>
          </div>
        </div>

        {/*  All Product */}
        <div className="mt-[30px] px-[16px]">
          <h1 className="font-bold">All Products</h1>

          {/* Products */}
          <div className="mt-[10px] grid grid-cols-2 gap-5">
            {isLoading ? (
              <p className="font-semibold ml-1 tracking-wider text-slate-500">Loading Products ...</p>
            ) : (
              <RenderProducts />
            )}
          </div>
        </div>

        {/* Navbar */}
        <Navbar />
      </section>
    </>
  );
}
