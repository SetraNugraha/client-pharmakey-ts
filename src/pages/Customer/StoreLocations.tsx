import { useNavigate } from "react-router-dom"
import { Navbar } from "../../components/Customer/Navbar"

interface Store {
  store_image: string
  city: string
  location: string
}

const storeLocations: Store[] = [
  {
    store_image: "ruko.jpeg",
    city: "Jakarta",
    location: "Jl. Pahlawan No.42",
  },
  {
    store_image: "ruko.jpeg",
    city: "Bekasi",
    location: "Jl. Kartini No.12",
  },
]

export default function StoreLocations() {
  const navigate = useNavigate()
  return (
    <>
      <section className="h-dvh">
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          {/* Button Back */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group">
            <img
              src="assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filter group-hover:invert group-hover:brightness-0"
            />
          </button>
          {/* Tiitle */}
          <h1 className="font-semibold text-xl absolute left-1/2 -translate-x-[50%]">
            Pharmakey Store
          </h1>
        </div>

        {/* Result Store */}
        <div className="mt-[30px] px-[16px]">
          <h1 className="font-bold">Results</h1>

          {/* Store */}
          <div className="mt-[10px] flex flex-col gap-y-5">
            {storeLocations.map((store, index) => (
              <button
                key={index}
                className="flex items-center justify-between gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:bg-[#FD915A] transition-all duration-300 ease-in-out group">
                <div className="flex items-center  gap-x-3">
                  <img
                    src={`assets/img/${store.store_image}`}
                    alt="store_image"
                    className="w-[70px] h-[70px] object-contain rounded-xl shadow-lg"
                  />
                  <div className="flex flex-col gap-y-1 items-start">
                    <h1 className="font-bold group-hover:text-white text-start">
                      {store.city}
                    </h1>
                    <p className="font-semibold text-slate-400 group-hover:text-white text-xs">
                      {store.location}
                    </p>
                  </div>
                </div>

                {/* maps */}
                <div className="flex items-center gap-x-2">
                  <img
                    src="assets/img/location.png"
                    alt="star"
                    className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                  />
                  <p className="font-semibold text-slate-400 group-hover:text-white">
                    Go to maps
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navbar */}
        <Navbar />
      </section>
    </>
  )
}
