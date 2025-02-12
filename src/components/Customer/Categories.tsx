import { useNavigate } from "react-router-dom"
import { useCategory } from "../../pages/CustomHooks/useCategory"
import { getImageUrl } from "../../utils/getImageUrl"

export const Categories = () => {
  const { categories, isLoading } = useCategory()
  const navigate = useNavigate()

  const RenderCategories = () => {
    return categories.map((category) => {
      const categoryImage = getImageUrl("categories", category.category_image)

      const handleSearchByCategory = () => {
        navigate(`/search-product?category=${encodeURIComponent(category.name)}`)
      }

      return (
        <button
          onClick={handleSearchByCategory}
          key={category.id}
          className="flex items-center gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:text-white hover:bg-[#FD915A] transition-all duration-300 ease-in-out group">
          <img
            src={categoryImage}
            alt="categories-icon"
            className="size-10 rounded-full transition-all duration-300 ease-in-out group-hover:p-1 group-hover:bg-white group-hover:rounded-full"
          />
          <h1 className="font-bold">{category.name}</h1>
        </button>
      )
    })
  }

  return (
    <>
      <div className="pt-[30px] px-[16px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold">Categories</h1>
          <div className="flex items-center gap-x-1 mr-3">
            <p className="text-xs text-slate-400 font-semibold">swipe</p>
            <img src="assets/img/arrow-right.png" alt="swipe" className="w-[15px] h-[15px] mt-1" />
          </div>
        </div>

        <div className="mt-[10px] flex items-center gap-x-5 overflow-x-auto scrollbar-hide">
          {/* Card Categories */}
          {isLoading ? (
            <p className="font-semibold ml-1 tracking-wider text-slate-500">Loading Categories ...</p>
          ) : (
            <RenderCategories />
          )}
        </div>
      </div>
    </>
  )
}
