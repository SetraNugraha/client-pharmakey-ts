import { useState } from "react"
import Modal from "../../../components/Admin/Modal"
import { useCategory } from "../../CustomHooks/useCategory"
import { useProducts } from "../../CustomHooks/useProduct"
import { CustomAlert } from "../../../utils/CustomAlert"
import { Product } from "../../../types"

interface ModalUpdateProductProps {
  product: Product | null
  onClose: () => void
  refreshDataProduct: () => void
}

export default function ModalUpdateProduct({ product, onClose, refreshDataProduct }: ModalUpdateProductProps) {
  const { categories } = useCategory()
  const { updateProduct, hasError } = useProducts()
  const findCategory = categories.find((item) => item.id === product?.category_id)

  // FORM State
  const [formEditProduct, setFormEditProduct] = useState<Partial<Product>>({ id: product?.id })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement

    setFormEditProduct((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files?.[0] : value,
    }))
  }

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response = await updateProduct(formEditProduct)

    if (response?.success) {
      CustomAlert("Success", "success", response?.message)
      onClose()
      await refreshDataProduct()
    } else {
      if (response?.message) {
        setFormEditProduct({ id: product?.id })
        CustomAlert("Error", "error", response?.message)
      }
    }
  }

  return (
    <Modal>
      <Modal.Header title="Edit Product" onClose={onClose} />
      <Modal.Body>
        <form onSubmit={handleEditProduct} className="w-[500px] flex flex-col gap-y-3">
          {/* Product Name */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Input product name here"
              className={`h-[40px] rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError && hasError.path === "name" ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
              }`}
              value={formEditProduct?.name ?? product?.name ?? ""}
              onChange={handleChange}
            />
            {hasError && hasError.path === "name" && (
              <p className="text-red-500 font-semibold tracking-wider ml-2">{hasError.message}</p>
            )}
          </div>

          {/* Select Category */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="category_id" className="font-semibold text-slate-500 ml-1">
              Select Category
            </label>
            <select
              name="category_id"
              id="category_id"
              className="h-[40px] pl-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              onChange={handleChange}>
              {/* Render Option */}
              <option value={product?.category_id}>{findCategory?.name}</option>
              {categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Product Price */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="price" className="font-semibold text-slate-500 ml-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              placeholder="Input product price here"
              className={`h-[40px] rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError && hasError.path === "price" ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
              }`}
              value={formEditProduct.price ?? product?.price ?? 0}
              onChange={handleChange}
            />

            {hasError && hasError.path === "price" && (
              <p className="text-red-500 font-semibold tracking-wider ml-2">{hasError.message}</p>
            )}
          </div>

          {/* Product description */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description" className="font-semibold text-slate-500 ml-1">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Add description product"
              className="border border-slate-300 rounded-lg px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={formEditProduct?.description ?? product?.description ?? ""}
              onChange={handleChange}></textarea>
          </div>

          {/* Add Product Image*/}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="product_image" className="font-semibold text-slate-500 ml-1">
              Add New Product Image
            </label>
            <input type="file" name="product_image" id="product_image" accept="image/*" onChange={handleChange} />
          </div>

          {/* Button Submit */}
          <button className="py-2 rounded-lg bg-green-500 text-white font-semibold text-lg tracking-wider mt-5 shadow-xl duration-300 hover:oulinte-none hover:ring-2 hover:ring-green-500 hover:text-green-500 hover:bg-white">
            Edit Product
          </button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
