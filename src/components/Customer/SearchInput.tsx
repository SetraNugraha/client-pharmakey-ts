import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

export const SearchInput = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userInput, setUserInput] = useState<string>("");

  const initialValue = searchParams.get("search") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    setUserInput(initialValue);
  }, [initialValue]);

  const handleSearch = async () => {
    navigate(`/search-product?search=${encodeURIComponent(userInput)}`);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search by name or category"
        className="w-full h-[52px] rounded-[50px] px-[24px] font-semibold text-slate-700 placeholder:text-[16px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
        value={userInput}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>
        <IoSearch className="absolute size-10 text-slate-500 top-1/2 -translate-y-1/2 right-[20px] hover:bg-slate-200 p-2 rounded-full transition-all duration-200" />
      </button>
    </div>
  );
};
