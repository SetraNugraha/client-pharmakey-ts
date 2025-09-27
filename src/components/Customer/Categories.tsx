import { useCategory } from "../../pages/CustomHooks/useCategory";
import { CardCategory } from "./CardCategory";

export const Categories = () => {
  const { categories, isLoading } = useCategory();

  return (
    <>
      <div className="mt-[20px] px-[16px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold">Categories</h1>
          <div className="flex items-center gap-x-1 mr-3">
            <p className="text-xs text-slate-400 font-semibold">swipe</p>
            <img src="assets/img/arrow-right.png" alt="swipe" className="w-[15px] h-[15px] mt-1" />
          </div>
        </div>

        <div className="px-2 py-5 flex items-center gap-x-3 overflow-x-auto scrollbar-hide">
          {/* Card Categories */}
          {isLoading ? (
            <p className="font-semibold ml-1 tracking-wider text-slate-500">Loading Categories ...</p>
          ) : (
            <CardCategory categories={categories} />
          )}
        </div>
      </div>
    </>
  );
};
