import { useRef, useState } from "react"
import { useCategory } from "../../CustomHooks/useCategory"
import Modal from "../../../components/Admin/Modal"
import { CustomAlert } from "../../../utils/CustomAlert"
import { Category } from "../../../types"

type ModalCreateCategoryProps = {
  onClose: () => void
  refreshDataCategory: () => void
}

export default function ModalCreateCategory({ onClose, refreshDataCategory }: ModalCreateCategoryProps) {
  const { createCategory, hasError } = useCategory()
  const fileInputRef = useRef<HTMLInputElement>(null)

  //  FORM State
  const [formCreateCategory, setFormCreateCategory] = useState<Partial<Category>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target

    setFormCreateCategory((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files?.[0] : value,
    }))
  }

  // CREATE Category
  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await createCategory(formCreateCategory)

    if (result?.success) {
      CustomAlert("Success", "success", result?.message)
      onClose()
      await refreshDataCategory()
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      if (result?.message) {
        CustomAlert("Error", "error", result?.message)
      }
    }
  }

  return (
    <Modal>
      <Modal.Header title="Create Category" onClose={onClose} />
      <Modal.Body>
        <form onSubmit={handleCreateCategory} className="w-[500px] flex flex-col gap-y-3">
          {/* Category Name */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formCreateCategory.name || ""}
              onChange={handleChange}
              placeholder="Input category name here"
              className={`h-[40px]  rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError && hasError.path === "name" ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
              }`}
            />
          </div>

          {hasError && hasError.path === "name" && (
            <div className="ml-2 -mt-2 tracking-wider text-red-500 font-semibold">
              <p>{hasError.message}</p>
            </div>
          )}

          {/* Add icon*/}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="category_image" className="font-semibold text-slate-500 ml-1">
              Add Icon
            </label>
            <input
              type="file"
              name="category_image"
              id="category_image"
              accept="image/*"
              ref={fileInputRef}
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
