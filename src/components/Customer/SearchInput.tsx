import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SearchInput = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [text, setText] = useState<string>("");
  const initialValue = searchParams.get("name") || searchParams.get("category") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (initialValue) {
      setText(initialValue);
    }
  }, [initialValue]);

  const handleSearch = async () => {
    navigate(`/search-product?name=${encodeURIComponent(text)}`);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search by name or category"
        className="w-full h-[52px] rounded-[50px] px-[24px] font-semibold text-slate-700 placeholder:text-[16px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FD915A]"
        value={text}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>
        <img
          src="assets/img/search.png"
          alt="search-icon"
          className="absolute top-1/2 -translate-y-1/2 right-[24px] hover:bg-slate-200 p-2 rounded-full transition-all duration-200"
        />
      </button>
    </div>
  );
};
