import { FaSackDollar } from "react-icons/fa6";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdMedication } from "react-icons/md";
import { useAdmin } from "../CustomHooks/useAdmin";
import { convertToRp } from "../../utils/convertToRp";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useAdmin();
  const date = new Date();
  const monthYearNow = date.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className="px-10 py-5">
        {/* Header */}
        <div>
          <h1 className="font-bold text-xl">Dashboard</h1>
        </div>

        {/* CARD */}
        <div className="flex items-center justify-between gap-x-7 mt-5">
          {/* Card Revenue */}
          <div className="flex items-center justify-around gap-x-5 pt-5 pb-3 w-full rounded-xl ring-1 ring-slate-300 shadow-lg shadow-gray-400">
            <div className="flex flex-col justify-between">
              <h1 className="font-bold text-2xl tracking-wider">Revenue</h1>

              {/* DATA REVENUE */}
              <div className="flex items-center gap-x-2">
                {/* TOTAL REVENUE */}
                <p className="font-semibold text-xl text-slate-600">{isLoading ? "loading data ..." : convertToRp(dashboard?.revenue?.total)} </p>

                {/* REVENUE GROWTH */}
                <div className="flex items-center">
                  {dashboard?.revenue?.isPositive ? <GoTriangleUp className="text-green-500" /> : <GoTriangleDown className="text-red-500" />}
                  <p className={`text-md font-semibold ${dashboard?.revenue?.isPositive ? "text-green-500" : "text-red-500"}`}>
                    {dashboard?.revenue?.growth} %
                  </p>
                </div>
              </div>

              {/* DATE */}
              <p className="font-semibold text-md mt-5 italic text-slate-500">{monthYearNow}</p>
            </div>
            <FaSackDollar size={65} className="text-slate-400" />
          </div>

          {/* Card Total Customers */}
          <div className="flex items-center justify-around gap-x-5 pt-5 pb-3 w-full rounded-xl ring-1 ring-slate-300 shadow-lg shadow-gray-400">
            <div className="flex flex-col justify-between">
              <h1 className="font-bold text-2xl tracking-wider">Total Customers</h1>

              {/* DATA CUSTOMER */}
              <p className="font-semibold text-xl text-slate-600">{isLoading ? "loading data ..." : dashboard?.totalCustomers} Registered</p>

              {/* DATE */}
              <p className="font-semibold text-md mt-5 italic text-slate-500">All the time</p>
            </div>
            <BsFillPersonVcardFill size={70} className="text-slate-400" />
          </div>

          {/* Card Total Products */}
          <div className="flex items-center justify-around gap-x-5 pt-5 pb-3 w-full rounded-xl ring-1 ring-slate-300 shadow-lg shadow-gray-400">
            <div className="flex flex-col justify-between">
              <h1 className="font-bold text-2xl tracking-wider">Total Products</h1>

              {/* DATA PRODUCT */}
              <p className="font-semibold text-xl text-slate-600">{isLoading ? "loading data ..." : dashboard?.totalProducts} Product</p>

              {/* DATE */}
              <p className="font-semibold text-md mt-5 italic text-slate-500">All the time</p>
            </div>
            <MdMedication size={75} className="text-slate-400" />
          </div>
        </div>

        {/* CART */}
        <div className="mt-7 w-full">
          {/* CART 1 & 2 */}
          <div className="flex items-center w-full gap-x-16">
            <div className="w-1/2 h-[350px] bg-white rounded-lg shadow-lg ring-1 ring-slate-300 shadow-gray-400 p-5">
              <h1>Top Selling Products</h1>
            </div>
            <div className="w-1/2 h-[350px] bg-white rounded-lg shadow-lg ring-1 ring-slate-300 shadow-gray-400 p-5">
              <h1>Status Orders {monthYearNow}</h1>
            </div>
          </div>
          {/*  CART 3 */}
          <div className="w-full my-7 h-[400px] bg-white rounded-lg shadow-lg ring-1 ring-slate-300 shadow-gray-400 p-5">
            <h1>Revenue Per Month</h1>
          </div>
        </div>
      </section>
    </>
  );
}
