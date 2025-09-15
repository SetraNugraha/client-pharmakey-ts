import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../Auth/useAuth";
import { useNavigate } from "react-router-dom";
import { CustomAlertConfirm, CustomAlert } from "../../utils/CustomAlert";

export const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogoutAdmin = async () => {
    const isConfirm = await CustomAlertConfirm("Are you sure want to Logout ? ");

    if (isConfirm) {
      CustomAlert("Logout Success", "success");
      if (user?.role === "ADMIN") {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }
      await logout();
    }
  };

  return (
    <>
      <section className="w-full bg-white sticky top-0 py-2 px-10 flex justify-between items-center border-b border-slate-300 shadow-xl">
        {/* Profile */}
        <div className="flex items-center gap-3">
          <img src="/assets/img/profile-default.png" alt="profile-image" className="h-[30px]" />
          <div className="leading-tight text-sm">
            <h1 className="text-slate-500 font-semibold">{user?.username}</h1>
            <p className="text-slate-400 font-semibold tracking-widest lowercase">{user?.role}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogoutAdmin} className="p-2 border border-slate-400 rounded-full shadow-xl duration-200 hover:bg-red-500 group">
          <i>
            <FaSignOutAlt size={15} className="text-red-500 rotate-180 group-hover:text-white" />
          </i>
        </button>
      </section>
    </>
  );
};
