/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom"
import { useProducts } from "../CustomHooks/useProduct"
import { useEffect, useState } from "react"
import { useCategory } from "../CustomHooks/useCategory"
import { Product } from "../../types"
import { useCart } from "../CustomHooks/useCart"
import { CustomAlert } from "../../utils/CustomAlert"
import { useAuth } from "../../Auth/useAuth"

import { getImageUrl } from "../../utils/getImageUrl"

type Grading = {
  icon: string
  name: string
}

const gradingList: Grading[] = [
  {
    icon: "popular",
    name: "Popular",
  },
  {
    icon: "grade",
    name: "Grade A",
  },
  {
    icon: "healty",
    name: "Healty",
  },
  {
    icon: "popular",
    name: "Popular",
  },
  {
    icon: "grade",
    name: "Grade A",
  },
]

export default function DetailProduct() {
  const { token } = useAuth()
  const { cartAction } = useCart()
  const { categories } = useCategory()
  const { getProductById } = useProducts()
  const navigate = useNavigate()
  const { productId } = useParams()
  const [product, setProduct] = useState<Product | null>(null)

  // Loading Product By ID
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // PRODUCT IMAGE
  const productImage = getImageUrl("products", product?.product_image)
  // CATEGORY NAME & IMAGE
  const category = categories.find((item) => item.id === product?.category_id)
  const categoryImage = getImageUrl("categories", category?.category_image)

  // GET data product by id
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        if (productId) {
          const result = await getProductById(parseInt(productId))
          if (result.success) {
            setProduct(result.data)
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          CustomAlert("Error", "error", error.message)
        }
        CustomAlert("Error", "error", "An unexpected error occured")
      } finally {
        setIsLoading(false)
      }
    }

    getData()
  }, [productId])

  const handleAddProductToCart = async () => {
    // Check Token
    if (!token) {
      CustomAlert("Authentication", "warning", "Login required. Please sign in to continue.")
      return navigate("/login")
    }

    if (!productId) {
      console.error("error add product to cart: Invalid product id")
      return
    }

    const result = await cartAction(parseInt(productId), "add")

    if (result?.success) {
      CustomAlert("Success", "success", result?.message)
      navigate("/carts")
    } else {
      CustomAlert("Error", "error", result?.message)
    }
  }

  const RenderDetailProduct = () => {
    return (
      <div className="pt-[55px] px-[24px]">
        <div className="flex flex-col justify-between gap-y-10">
          {/* Body */}
          <div>
            {/* Product Name */}
            <div className="flex flex-col gap-y-3">
              <div>
                <h1 className="font-bold text-2xl">{product?.name}</h1>
              </div>

              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                {/* Category */}
                <div className="flex items-center gap-x-2">
                  <img src={categoryImage} alt="category" className="size-8 rounded-full object-contain" />
                  <h1 className="font-semibold">{category?.name}</h1>
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
              <p className=" text-slate-600 leading-loose">{product?.description || "No description"}</p>
            </div>

            {/* Grading */}
            <div className="mt-[20px] flex items-center gap-x-5 overflow-x-auto scrollbar-hide">
              {gradingList.map((item, index) => (
                <div
                  key={index}
                  className="w-[100px] h-[100px] flex flex-col items-center justify-center gap-y-2 border border-slate-300 rounded-[16px] shrink-0">
                  <img src={`/assets/img/${item.icon}.png`} alt="grade" />
                  <h1 className="font-semibold">{item.name}</h1>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="mt-[20px]">
              {/* text testimonial */}
              <p className="tracking-wider">
                My kid was happier whenever he is playing without artificial toys, full energy yeah!
              </p>
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
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col items-start gap-y-1">
              <h1 className="text-2xl font-bold">Rp. {product?.price.toLocaleString("id-ID")}</h1>
              <p className="text-slate-400">/quantity</p>
            </div>

            {/* Button Add To Cart */}
            <div>
              <button
                onClick={handleAddProductToCart}
                className="px-6 py-3 bg-[#FD915A] text-white font-bold rounded-[50px] hover:bg-white hover:text-[#FD915A] transition-all duration-200 ease-in-out hover:border-[2px] hover:border-[#FD915A] shadow-xl">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="h-dvh">
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          {/* Button Back */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group">
            <img
              src="/assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filter group-hover:invert group-hover:brightness-0"
            />
          </button>

          {/* Title */}
          <h1 className="font-semibold text-xl  absolute left-1/2 -translate-x-[50%]">Details</h1>
        </div>

        {/* Product Image */}
        <div>
          {isLoading ? (
            <p className="font-semibold text-center mt-5 tracking-wider text-slate-500">Loading Image ...</p>
          ) : (
            <img
              src={productImage}
              alt="product-image"
              className="absolute top-[15%] left-1/2 -translate-x-1/2 size-64 xl:size-64 object-contain"
            />
          )}
        </div>

        {/* Render Detail */}
        <div className="bg-white border-t-2 border-slate-300 rounded-t-[60px] mt-[65%] xl:max-h-screen xl:pb-12">
          {isLoading ? (
            <p className="font-semibold text-center ml-1 tracking-wider text-slate-500 bg-[#F7F1F0] -mt-5">
              Loading Products Detail...
            </p>
          ) : (
            <RenderDetailProduct />
          )}
        </div>
      </section>
    </>
  )
}
