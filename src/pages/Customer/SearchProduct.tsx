/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useSearchParams } from "react-router-dom"
import { SearchInput } from "../../components/Customer/SearchInput"
import { Product } from "../../types"
import {  useEffect, useState } from "react"
import { useProducts } from "../CustomHooks/useProduct"
import { getImageUrl } from "../../utils/getImageUrl"
import { CustomAlert } from "../../utils/CustomAlert"

export default function SearchProduct() {
  const { searchProducts } = useProducts()
  const [products, setProducts] = useState<Product[]>([])
  const [searchParams] = useSearchParams()
  const query = searchParams.get("name") || searchParams.get("category") || ""

  useEffect(() => {
    const getData = async () => {
      const result = await searchProducts(query)

      if (result?.success) {
        setProducts(result.data)
      } else {
        CustomAlert("Error", "error", result.message || "An unexpected error occured")
      }
    }

    if (query) {
      getData()
    }
  }, [query])

  const RenderSearchProducts = () => {
    if (products.length === 0 || query.trim() === "") {
      return <p className="font-semibold text-slate-500 tracking-wider">Product not found</p>
    }
    return products.map((product, index) => {
      const productImage = getImageUrl("products", product.product_image)
      return (
        <Link
          key={index}
          to={`/detail-product/${product.slug}/${product.id}`}
          className="flex items-center justify-between gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:bg-[#FD915A] transition-all duration-300 ease-in-out group">
          {/* Products */}
          <div className="flex items-center  gap-x-3">
            <img src={productImage} alt="product-image" className="w-[70px] h-[70px] object-contain" />
            <div className="flex flex-col gap-y-1 items-start">
              <h1 className="font-bold group-hover:text-white text-start">{product.name}</h1>
              <p className="font-semibold text-slate-400 group-hover:text-white">
                Rp. {product.price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* 5 Star */}
          <div>
            <img
              src="assets/img/star.png"
              alt="star"
              className="group-hover:filter group-hover:brightness-0 group-hover:invert"
            />
          </div>
        </Link>
      )
    })
  }

  return (
    <>
      <section className="min-h-dvh px-[16px] pb-10">
        {/* Header */}
        <div className="pt-[30px] flex items-center justify-between">
          <Link
            to="/"
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group">
            <img
              src="assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filter group-hover:invert group-hover:brightness-0"
            />
          </Link>
          <h1 className="font-semibold text-xl  absolute left-1/2 -translate-x-[50%]">Search Products</h1>
        </div>

        {/* Search Input  */}
        <div className="mt-[30px]">
          <SearchInput />
        </div>

        {/* Result Search Product */}
        <div className="mt-[30px]">
          <h1 className="font-bold">Results</h1>

          {/* Products */}
          <div className="mt-[10px] flex flex-col gap-y-5">
            <RenderSearchProducts />
          </div>
        </div>
      </section>
    </>
  )
}
