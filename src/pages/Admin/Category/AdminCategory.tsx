import { useState } from "react"
import { MdEditSquare, MdDelete, MdLibraryAdd } from "react-icons/md"
import { useCategory } from "../../CustomHooks/useCategory"
import ModalCreateCategory from "./ModalCreateCategory"
import ModalUpdateCategory from "./ModalUpdateCategory"
import { CustomAlertConfirm, CustomAlert } from "../../../utils/CustomAlert"
import { Category } from "../../../types"

export default function AdminCategory() {
  const { categories, isLoading, pagination, refetchCategories, deleteCategory, goToPrevPage, goToNextPage } =
    useCategory()
  const [modalCreate, setModalCreate] = useState<boolean>(false)
  const [modalEdit, setModalEdit] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Open Modal Edit
  const handleButtonEdit = (category: Category) => {
    setSelectedCategory(category)
    setModalEdit(true)
  }

  // DELETE Data
  const handleDeleteCategory = async (category: Category) => {
    const categoryId = category.id ? category.id : null
    const title = `Are you sure want to delete ${category.name} ?`
    const isConfirm = await CustomAlertConfirm(title)

    if (isConfirm) {
      const response = await deleteCategory(categoryId)
      if (response.success) {
        CustomAlert("Succes", "success", response.message)
        await refetchCategories()
      } else {
        CustomAlert("Error", "error", response)
        return false
      }
    } else {
      CustomAlert("Cancel", "error", "Delete Category Cancelled")
    }
  }

  const RenderCategories = () => {
    return categories.map((category) => {
      const categoryImage = category.category_image
        ? `${import.meta.env.VITE_IMAGE_URL}/categories/${category.category_image}`
        : "/assets/img/no-image.png"

      return (
        <tr
          key={category.id}
          className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          {/* Icon */}
          <td className="py-3">
            <div className="flex justify-center items-center">
              <img src={categoryImage} alt="icon-category" className="size-11 rounded-full" />
            </div>
          </td>

          {/* name */}
          <td className="py-3 tracking-widest text-xl text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {category.name}
          </td>

          {/* Action Button */}
          <td className="py-3">
            <div className="flex items-center justify-center gap-x-3">
              {/* Edit */}
              <button onClick={() => handleButtonEdit(category)}>
                <MdEditSquare size={30} className="text-green-500 hover:text-blue-500 duration-200" />
              </button>

              {/* Delete */}
              <button onClick={() => handleDeleteCategory(category)}>
                <MdDelete size={30} className="text-red-500 hover:text-slate-400 duration-200" />
              </button>
            </div>
          </td>
        </tr>
      )
    })
  }

  return (
    <>
      <section className="px-10 py-5">
        <div>
          {/* Title */}
          <h1 className="font-bold text-2xl mb-5">Categories</h1>
          {/* Button Add New Category */}
          <button
            onClick={() => setModalCreate(true)}
            className="px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 hover:outline-none hover:ring-2 hover:ring-blue-500 duration-300 mb-5 flex items-center gap-x-2 shadow-lg shadow-gray-300">
            <span>
              <MdLibraryAdd size={22} />
            </span>
            Create Category
          </button>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-5 py-3">
                    Icon
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="font-semibold text-slate-400 tracking-wider">
                    <td colSpan={3} className="py-5 text-center text-xl">
                      Loading ...
                    </td>
                  </tr>
                ) : (
                  <RenderCategories />
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="absolute bottom-24  flex items-center gap-x-3 mt-5 ml-3">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={goToPrevPage}
              className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0">
              Prev
            </button>
            <p className="px-3 py-1 ring-2 ring-slate-300 rounded-lg font-semibold text-slate-400">
              {pagination.currPage}
            </p>
            <button
              disabled={!pagination.hasNextPage}
              onClick={goToNextPage}
              className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0">
              Next
            </button>
          </div>
        </div>

        {/* Modal Create Category */}
        {modalCreate && (
          <ModalCreateCategory onClose={() => setModalCreate(false)} refreshDataCategory={refetchCategories} />
        )}

        {/* Modal Edit Category */}
        {modalEdit && (
          <ModalUpdateCategory
            onClose={() => setModalEdit(false)}
            refreshDataCategory={refetchCategories}
            category={selectedCategory}
          />
        )}
      </section>
    </>
  )
}
