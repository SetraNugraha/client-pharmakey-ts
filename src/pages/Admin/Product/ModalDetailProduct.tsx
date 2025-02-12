import Modal from "../../../components/Admin/Modal"
import { useCategory } from "../../CustomHooks/useCategory"
import { Product } from "../../../types"

type ModalDetailProductProps = {
  product: Product | null
  onClose: () => void
}

export default function ModalDetailProduct({ product, onClose }: ModalDetailProductProps) {
  const { categories } = useCategory()
  const findCategory = categories.find((item) => item.id === product?.category_id)
  const productImage = product?.product_image
    ? `${import.meta.env.VITE_IMAGE_URL}/products/${product.product_image}`
    : "/assets/img/no-image.png"

  return (
    <Modal>
      <Modal.Header title="Detail Product" onClose={onClose} />
      <Modal.Body>
        <section className="w-[750px] items-start flex gap-x-5">
          {/* Image */}
          <div className="flex flex-shrink-0">
            <img src={productImage} alt="product-image" className="size-60 object-contain" />
          </div>

          {/* Container Text */}
          <div className="flex flex-col gap-y-3 w-full">
            <div className="flex bg-red-200s">
              {/* Product Name */}
              <div className="flex flex-col w-1/2 ">
                <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                  Name
                </label>
                <p className="font-semibold text-slate-500 w-[90%]">{product?.name}</p>
              </div>

              {/* Product Category */}
              <div className="flex flex-col w-1/2 pl-5">
                <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                  Category
                </label>
                <p className="font-semibold text-slate-500 w-[90%]">{findCategory?.name}</p>
              </div>

              {/* Product Price */}
              <div className="flex flex-col w-1/3">
                <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                  Price
                </label>
                <p className="font-semibold text-slate-500">
                  {product?.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>

            {/* Product About */}
            <div className="flex flex-col">
              <label htmlFor="name" className="font-bold text-slate-600 text-lg">
                Description
              </label>
              <p className="font-semibold text-slate-500 text-justify">
                {product?.description || "No description added"}
              </p>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  )
}
