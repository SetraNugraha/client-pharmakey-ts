/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import { useProducts } from "../../pages/CustomHooks/useProduct"
import { getImageUrl } from "../../utils/getImageUrl"
import { useEffect } from "react"

export const LatestProducts = () => {
  const { products, isLoading, getAllProducts } = useProducts()

  useEffect(() => {
    getAllProducts(1, 4)
  }, [])

  const RenderLatestProducts = () => {
    return products.map((product) => {
      const productImage = getImageUrl("products", product.product_image)
      return (
        <Link
          key={product.id}
          to={`/detail-product/${product.slug}/${product.id}`}
          className="flex flex-col items-center flex-shrink-0 gap-y-3 p-5 w-[170px] h-[220px] bg-white rounded-[16px]  hover:bg-[#ef966a]  transition-all duration-300 ease-in-out group">
          {/* Product Image */}
          <img src={productImage} alt="product-image" className="size-24 object-contain" />

          {/* Product Name & Price */}
          <div className="h-full w-full flex flex-col text-center items-center justify-between">
            <h1 className="font-bold group-hover:text-white whitespace-normal transition-all duration-300 ease-in-out group">
              {product.name}
            </h1>
            <p className="text-slate-400 font-semibold  group-hover:text-white transition-all duration-300 ease-in-out group">
              Rp. {product.price.toLocaleString("id-ID")}
            </p>
          </div>
        </Link>
      )
    })
  }
  return (
    <>
      <div className="pt-[30px] px-[16px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold">Latest Products</h1>
          <div className="flex items-center gap-x-1 mr-3">
            <p className="text-xs text-slate-400 font-semibold">swipe</p>
            <img src="assets/img/arrow-right.png" alt="swipe" className="w-[15px] h-[15px] mt-1" />
          </div>
        </div>

        <div className="mt-[10px] flex items-center gap-x-5 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {/* Card Categories */}
          {isLoading ? (
            <p className="font-semibold ml-1 tracking-wider text-slate-500">Loading Products ...</p>
          ) : (
            <RenderLatestProducts />
          )}
        </div>
      </div>
    </>
  )
}
