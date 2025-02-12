import { useEffect, useRef, useState } from "react"
import Modal from "../../../components/Admin/Modal"
import { useCategory } from "../../CustomHooks/useCategory"
import { useProducts } from "../../CustomHooks/useProduct"
import { CustomAlert } from "../../../utils/CustomAlert"
import { Product } from "../../../types"

interface ModalCreateProductProps {
  onClose: () => void
  refreshDataProduct: () => void
}

export default function ModalCreateProduct({ onClose, refreshDataProduct }: ModalCreateProductProps) {
  const { categories } = useCategory()
  const { createProduct, hasError } = useProducts()
  const produtImageRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const priceInputRef = useRef<HTMLInputElement>(null)
  const nameError = hasError?.path === "name"
  const priceError = hasError?.path === "price"

  // Form
  const [formCreateProduct, setFormCreateProduct] = useState<Partial<Product>>({})

  // Handle Input Error
  useEffect(() => {
    const isInputError = (ref: React.RefObject<HTMLInputElement>, hasError: boolean) => {
      if (ref.current) {
        ref.current.classList.toggle("ring-2", hasError)
        ref.current.classList.toggle("ring-red-500", hasError)
        ref.current.classList.toggle("ring-slate-300", !hasError)
      }
    }

    isInputError(nameInputRef, hasError?.path === "name")
    isInputError(priceInputRef, hasError?.path === "price")
  }, [hasError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement

    setFormCreateProduct((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files?.[0] : value,
    }))
  }

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await createProduct(formCreateProduct)

    if (response?.success) {
      CustomAlert("Succes", "success", response?.message)
      onClose()
      await refreshDataProduct()
    } else {
      if (produtImageRef.current) {
        produtImageRef.current.value = ""
      }

      if (response?.message) {
        CustomAlert("Error", "error", response?.message)
      }
    }
  }

  return (
    <Modal>
      <Modal.Header title="Create New Product" onClose={onClose} />
      <Modal.Body>
        <form onSubmit={handleCreateProduct} className="w-[500px] flex flex-col gap-y-3">
          {/* Product Name */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
              Product Name
            </label>
            <input
              required
              ref={nameInputRef}
              type="text"
              name="name"
              id="name"
              placeholder="Input product name here"
              className="h-[40px] ring-1 ring-slate-300 rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formCreateProduct.name || ""}
              onChange={handleChange}
            />
            {nameError && <span className="text-red-500 tracking-wider font=semibold ml-2">{hasError.message}</span>}
          </div>

          {/* Select Category */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="category" className="font-semibold text-slate-500 ml-1">
              Select Category
            </label>
            <select
              required
              name="category_id"
              id="category"
              className="h-[40px] pl-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              value={formCreateProduct.category_id || ""}
              onChange={handleChange}>
              <option value={""}>--- Select Category ----</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Price */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="price" className="font-semibold text-slate-500 ml-1">
              Price
            </label>
            <input
              required
              ref={priceInputRef}
              type="number"
              name="price"
              id="price"
              placeholder="Input product price here"
              className={`h-[40px] ring-1 ring-slate-300  rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formCreateProduct.price || ""}
              onChange={handleChange}
            />

            {/* Validation Error */}
            {priceError && <span className="text-red-500 tracking-wider font=semibold ml-2">{hasError.message}</span>}
          </div>

          {/* Product Description */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description" className="font-semibold text-slate-500 ml-1">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Add description product"
              rows={4}
              className="border border-slate-300 rounded-lg px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formCreateProduct.description || ""}
              onChange={handleChange}></textarea>
          </div>

          {/* Add Product Image*/}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="product_image" className="font-semibold text-slate-500 ml-1">
              Add Product Image
            </label>
            <input
              type="file"
              id="product_image"
              name="product_image"
              accept="image/*"
              ref={produtImageRef}
              onChange={handleChange}
            />
          </div>

          {/* Button Submit */}
          <button className="py-2 rounded-lg bg-blue-500 text-white font-semibold text-lg tracking-wider mt-5 shadow-xl hover:oulinte-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
