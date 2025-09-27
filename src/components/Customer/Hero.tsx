import { SearchInput } from "./SearchInput";

export const Hero = () => {
  return (
    <>
      <div className="pt-[30px] px-[16px]">
        <h1 className="text-[38px] font-extrabold text-center pb-[10px] leading-tight">
          We Provide{" "}
          <span>
            <br />
            Best Medicines
          </span>
        </h1>

        {/* Search Input */}
        <SearchInput />

        <div className="relative pt-[30px] w-full">
          {/* Hero Decor  */}
          <img src="assets/img/hero-decor.png" alt="hero-decor" className="bg-[#E6D3F8] rounded-[15px] h-[98px] w-full" />

          {/* Desc */}
          <div className="absolute top-[45px] flex items-center justify-between w-full px-[20px]">
            <h1 className="font-bold text-[16px] w-[270px]">Stay safe, use medication according to doctor's recommendations</h1>
            <img src="assets/img/give-medicine.png" alt="hero-decor" />
          </div>
        </div>
      </div>
    </>
  );
};
