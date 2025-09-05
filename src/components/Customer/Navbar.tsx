import { Link, useLocation } from "react-router-dom"

interface Link {
  icon: string
  title: string
  url: string
}

const navbarLink: Link[] = [
  {
    icon: "home",
    title: "Home",
    url: "/",
  },

  {
    icon: "product",
    title: "Product",
    url: "/product",
  },

  {
    icon: "orders",
    title: "Transactions",
    url: "/transactions",
  },

  {
    icon: "profile",
    title: "Profile",
    url: "/profile",
  },
]

export const Navbar = () => {
  const location = useLocation()
  return (
    <>
      <nav className="fixed bottom-10 mx-auto max-w-md w-full px-[16px]">
        <div className="bg-white shadow-lg shadow-gray-400 border boder-slate-200 rounded-[20px] ">
          <ul className="text-[#1B76FF] font-semibold flex justify-between items-center pt-3 px-[30px]">
            {navbarLink.map((item, index) => {
              const active: boolean = location.pathname === item.url
              return (
                <li
                  key={index}
                  className="relative  cursor-pointer transition-all duration-300 ease-in-out  group pb-3">
                  <Link
                    to={item.url}
                    className={`group-hover:text-[#FD915A] flex flex-col items-center gap-y-1 ${
                      active ? "text-[#FD915A]" : ""
                    }`}>
                    <img
                      src={`/assets/img/${item.icon}.png`}
                      alt={item.title}
                      className={` w-[22px] h-[22px] ${active ? "hidden" : "group-hover:hidden"}`}
                    />
                    {/* hover img */}
                    <img
                      src={`/assets/img/${item.icon}-hover.svg`}
                      alt={item.title}
                      className={` w-[22px] h-[22px] ${active ? "block" : "hidden  group-hover:block"}`}
                    />
                    {/* Title */}
                    {item.title}
                  </Link>

                  {/* Horizontal line */}
                  <span
                    className={`absolute bottom-0 w-full h-[5px] bg-[#FD915A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}></span>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
