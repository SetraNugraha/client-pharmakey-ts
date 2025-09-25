/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
import { useCustomer } from "../../pages/CustomHooks/useCustomer";
import { getImageUrl } from "../../utils/getImageUrl";

export const Header = () => {
  const { user } = useAuth();
  const { authCustomer } = useCustomer(user?.userId);
  const profileImage = getImageUrl("customers", authCustomer?.profile_image);

  return (
    <>
      <header className="w-full px-[16px]">
        <div className="pt-[30px] flex items-center justify-between">
          {/* Profile */}
          <Link to="/profile" className="flex gap-x-2 items-center">
            {/* Profile Image */}

            <img src={profileImage} alt="profile_image" className="size-16 object-contain p-2 bg-white rounded-full" />

            {/* Name & Role */}
            <div className="flex flex-col leading-tight">
              <h1 className="font-semibold text-primary text-[16px] tracking-wider capitalize">{user?.username.toLowerCase() || "Guest"}</h1>
              <p className="text-[14px] font-semibold text-slate-500 capitalize tracking-wider">{user?.role.toLowerCase()}</p>
            </div>
          </Link>

          {/* Button Cart */}
          <Link
            to="/carts"
            className="px-3 py-1 flex gap-x-1 items-center rounded-full cursor-pointer bg-primary hover:bg-white hover:outline-none hover:ring-2 hover:ring-primary duration-300 group shadow-lg shadow-slate-300"
          >
            <div className="p-1 group-hover:bg-primary group-hover:rounded-full duration-300">
              <img src="assets/img/cart.png" alt="cart" id="cart" className="filter invert brightness-0 " />
            </div>
            <p className=" font-semibold text-white tracking-wider group-hover:text-primary">Cart</p>
          </Link>
        </div>
      </header>
    </>
  );
};
