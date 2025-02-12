import React, { useState } from "react"
import { useCategory } from "../../CustomHooks/useCategory"
import Modal from "../../../components/Admin/Modal"
import { CustomAlert } from "../../../utils/CustomAlert"
import { Category } from "../../../types"

type ModalUpdateCategoryProps = {
  category: Category | null
  onClose: () => void
  refreshDataCategory: () => void
}

export default function ModalUpdateCategory({ category, onClose, refreshDataCategory }: ModalUpdateCategoryProps) {
  const { updateCategory, hasError } = useCategory()

  // FORM State
  const [formEditCategory, setFormEditCategory] = useState<Partial<Category>>({ id: category?.id })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target
    setFormEditCategory((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files?.[0] : value,
    }))
  }

  // EDIT Data
  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await updateCategory(formEditCategory)

    if (result?.success) {
      CustomAlert("Success", "success", result?.message)
      onClose()
      await refreshDataCategory()
    } else {
      if (result?.message) {
        CustomAlert("Error", "error", result?.message)
      }
    }
  }

  return (
    <Modal>
      <Modal.Header title="Edit Category" onClose={onClose} />
      <Modal.Body>
        {formEditCategory && (
          <form onSubmit={handleUpdateCategory} className="w-[500px] flex flex-col gap-y-3">
            {/* Category Name */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Input category name here"
                className={`h-[40px] rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasError && hasError.path === "name" ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
                }`}
                value={formEditCategory.name ?? category?.name ?? ""}
                onChange={handleChange}
              />
            </div>

            {hasError && hasError.path === "name" && (
              <p className="text-red-500 font-semibold tracking-wider ml-2 -mt-2">{hasError.message}</p>
            )}

            {/* Add icon*/}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
                Add New Icon
              </label>
              <input type="file" name="category_image" id="category_image" onChange={handleChange} accept="image/*" />
            </div>

            {/* Button Submit */}
            <button className="py-2 rounded-lg bg-green-500 text-white font-semibold text-lg tracking-wider mt-5 shadow-xl duration-300 hover:oulinte-none hover:ring-2 hover:ring-green-500 hover:text-green-500 hover:bg-white">
              Edit Category
            </button>
          </form>
        )}
      </Modal.Body>
    </Modal>
  )
}
