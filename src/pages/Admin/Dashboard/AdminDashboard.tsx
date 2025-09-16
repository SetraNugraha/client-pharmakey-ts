import { FaSackDollar } from "react-icons/fa6";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdMedication } from "react-icons/md";
import { useAdmin } from "../../CustomHooks/useAdmin";
import { convertToRp } from "../../../utils/convertToRp";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import moment from "moment";
import { PaymentMethod } from "../../../types/transaction.type";

export default function AdminDashboard() {
  ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend, ChartDataLabels, PointElement, LineElement);
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
          <div className="grid grid-cols-5 gap-4 w-full">
            {/* TOP SELLING PRODUCTS */}
            <div className="col-span-3 h-[350px] bg-white rounded-lg shadow-lg ring-1 ring-slate-300 shadow-gray-400 p-5">
              <h1 className="font-bold text-slate-600 tracking-wider">Top Selling Products</h1>
              <div className="w-full h-[300px]">
                <Bar
                  data={{
                    labels: dashboard?.topSellingProduct?.map((data) => data.productName),
                    datasets: [
                      {
                        label: "Top Selling Product All The Time",
                        data: dashboard?.topSellingProduct?.map((data) => data.totalSold),
                        backgroundColor: ["rgba(59, 130, 246, 0.7)"],
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      datalabels: {
                        color: "#fff",
                        font: {
                          size: 16,
                          weight: "bolder",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* STATUS ORDERS PER MONTH */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="text-center h-[350px] bg-white rounded-lg shadow-lg ring-1 ring-slate-300 shadow-gray-400 p-5">
                <h1 className="font-bold text-slate-600 tracking-wider">Status Orders {monthYearNow}</h1>

                <div className="w-full max-h-[300px] py-10">
                  <Doughnut
                    data={{
                      labels: dashboard?.statusOrders?.map((data) => data.status),
                      datasets: [
                        {
                          label: "Top Selling Product All The Time",
                          data: dashboard?.statusOrders?.map((data) => data.total),
                          backgroundColor: dashboard?.statusOrders?.map((data) => {
                            if (data.status === "SUCCESS") return "rgba(34,197,94,0.7)"; // green-500
                            if (data.status === "CANCELLED") return "rgba(239,68,68,0.7)"; // red-500
                            if (data.status === "PENDING") return "rgba(249,115,22,0.7)"; // orange-500
                            return "rgba(107,114,128,0.7)"; // gray-500 (default kalau ada status lain)
                          }),
                          borderColor: dashboard?.statusOrders?.map((data) => {
                            if (data.status === "SUCCESS") return "rgba(34,197,94,1)";
                            if (data.status === "CANCELLED") return "rgba(239,68,68,1)";
                            if (data.status === "PENDING") return "rgba(249,115,22,1)";
                            return "rgba(107,114,128,1)";
                          }),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    width={150}
                    height={200}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        datalabels: {
                          color: "#fff",
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                          formatter: (value) => value, // tampilkan angka asli
                        },
                        legend: {
                          position: "top",
                          labels: {
                            font: {
                              size: 14,
                              weight: "bolder",
                            },
                          },
                        },
                      },
                    }}
                    plugins={[ChartDataLabels]}
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD PER MONTH */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="text-center h-[350px] bg-white rounded-lg shadow-lg ring-1 ring-slate-300 shadow-gray-400 p-5">
                <h1 className="font-bold text-slate-600 tracking-wider">Payment Method {monthYearNow}</h1>

                <div className="w-full max-h-[300px] py-7">
                  <Doughnut
                    data={{
                      labels: dashboard?.paymentMethodPerMonth?.map((data) => data.payment_method),
                      datasets: [
                        {
                          label: "Top Selling Product All The Time",
                          data: dashboard?.paymentMethodPerMonth?.map((data) => data.total),
                          backgroundColor: dashboard?.paymentMethodPerMonth?.map((data) => {
                            if (data.payment_method === PaymentMethod.TRANSFER) return "rgba(91, 83, 240, 0.8)";
                            if (data.payment_method === PaymentMethod.COD) return "rgba(207, 65, 230, 0.8)";
                            return "rgba(107,114,128,0.7)";
                          }),
                          borderColor: dashboard?.paymentMethodPerMonth?.map((data) => {
                            if (data.payment_method === PaymentMethod.TRANSFER) return "rgba(91, 83, 240, 0.8)";
                            if (data.payment_method === PaymentMethod.COD) return "rgba(207, 65, 230, 0.8)";
                            return "rgba(107,114,128,1)";
                          }),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    width={150}
                    height={200}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        datalabels: {
                          color: "#fff",
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                          formatter: (value) => value, 
                        },
                        legend: {
                          position: "top",
                          labels: {
                            font: {
                              size: 14,
                              weight: "bolder",
                            },
                          },
                        },
                      },
                    }}
                    plugins={[ChartDataLabels]}
                  />
                </div>
              </div>
            </div>
          </div>
          {/*  CART 3 */}
          <div className="w-full my-7 h-[400px] bg-white rounded-lg shadow-lg ring-1 ring-slate-300 shadow-gray-400 p-5">
            <h1 className="font-bold text-slate-600 tracking-wider">Revenue Per Month {new Date().getFullYear()}</h1>
            <div className="w-full h-[350px]">
              <Line
                data={{
                  labels: dashboard?.revenuePerMonth?.map((data) => moment(data.month).format("MMMM")),
                  datasets: [
                    {
                      label: "Revenue Per Month",
                      data: dashboard?.revenuePerMonth?.map((data) => data.revenue),
                      backgroundColor: ["rgba(59, 130, 246, 0.7)"],
                      borderColor: ["rgba(59, 130, 246, 0.7)"],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => convertToRp(context.raw as number),
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => convertToRp(value as number),
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
