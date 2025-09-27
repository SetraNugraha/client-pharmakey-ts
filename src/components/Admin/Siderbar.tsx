import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "../Admin/Navbar";
import { MdArrowBackIosNew, MdInsertChart } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { FaMedrt } from "react-icons/fa";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { IoPeopleCircleSharp } from "react-icons/io5";

interface SidebarProps {
  children: ReactNode;
}

interface Menus {
  path: string;
  title: string;
  icon: ReactNode;
}

const menus: Menus[] = [
  {
    path: "dashboard",
    title: "Dashboard",
    icon: <MdInsertChart />,
  },

  {
    path: "customer",
    title: "Customer",
    icon: <IoPeopleCircleSharp />,
  },

  {
    path: "categories",
    title: "Categories",
    icon: <RiDashboardFill />,
  },

  {
    path: "products",
    title: "Products",
    icon: <AiFillMedicineBox />,
  },
  {
    path: "transactions",
    title: "Transactions",
    icon: <FaFileInvoiceDollar />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [expand, setExpand] = useState<boolean>(true);
  const location = useLocation();

  return (
    <>
      <section className="flex z-50">
        <nav className={`sticky top-0 left-0 h-screen px-5 pt-2 bg-slate-700 duration-300 ${expand ? "w-72" : "w-20"}`}>
          <div className="flex">
            {/* Logo */}
            <div className="m-2 flex items-center gap-4">
              <FaMedrt className="text-[30px] text-white" />
              {expand && <h1 className="text-xl text-white font-bold">PharmaKey</h1>}
            </div>
            {/* Expand Button */}
            <button
              onClick={() => setExpand(!expand)}
              className="absolute top-1/2 -translate-y-1/2 -right-4 p-2 bg-white rounded-full border-[2px] border-slate-600 hover:bg-slate-700 group duration-200 hover:border-white"
            >
              <MdArrowBackIosNew className={`group-hover:text-white ${expand ? "" : "rotate-180"}`} />
            </button>
          </div>
          {/* Menu Sidebar */}
          <ul className="flex flex-col gap-3 mt-7 text-white font-semibold">
            {menus.map((menu, index) => {
              const adminPath: string = `/admin/${menu.path}`;
              const isActive: boolean = location.pathname === adminPath;
              return (
                <Link
                  key={index}
                  to={`/admin/${menu.path}`}
                  className={`p-2 flex items-center gap-3 rounded-lg  duration-200 active:bg-blue-500 ${
                    isActive ? "bg-blue-500 hover:bg-blue-700" : "bg-slate-500 hover:bg-slate-600"
                  }`}
                >
                  <i className="text-[22px]">{menu.icon}</i>
                  {expand && <h1>{menu.title}</h1>}
                </Link>
              );
            })}
          </ul>
        </nav>

        <div className="flex-grow">
          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <main>{children}</main>
        </div>
      </section>
    </>
  );
};
