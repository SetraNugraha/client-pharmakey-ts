import { Category } from "../../types/category.type";
import { useNavigate } from "react-router-dom";

export const CardCategory = ({ categories }: { categories?: Category[] }) => {
  const navigate = useNavigate();
  // NOT FOUND
  if (!categories || categories?.length == 0) {
    return <p className="font-semibold ml-1 tracking-wider text-slate-500">Categories not found</p>;
  }

  return categories?.map((category) => {
    const handleSearchByCategory = () => {
      navigate(`/search-product?search=${encodeURIComponent(category.name)}`);
    };

    return (
      <button
        onClick={handleSearchByCategory}
        key={category.id}
        className="flex items-center gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 ring-2 ring-slate-200 shadow-lg shadow-slate-300 hover:text-white hover:bg-primary transition-all duration-300 ease-in-out group"
      >
        <img
          src={category.image_url || "/assets/img/no-image.png"}
          alt="categories-icon"
          className="size-10 rounded-full transition-all duration-300 ease-in-out group-hover:p-1 group-hover:bg-white group-hover:rounded-full"
        />
        <h1 className="font-bold">{category.name}</h1>
      </button>
    );
  });
};
