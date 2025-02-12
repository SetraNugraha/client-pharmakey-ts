import { useNavigate } from "react-router-dom"
import { Navbar } from "../../components/Customer/Navbar"

interface Doctor {
  doctor_image: string
  name: string
  specialize: string
}

const doctors: Doctor[] = [
  {
    doctor_image: "doctor1.jpeg",
    name: "Dr. Jhon Doe",
    specialize: "Cardiology",
  },
  {
    doctor_image: "doctor2.jpeg",
    name: "Dr. Stefani",
    specialize: "Dermatology",
  },
  {
    doctor_image: "doctor3.jpeg",
    name: "Dr. Abdull",
    specialize: "Psychiatry",
  },
]

export default function Doctors() {
  const navigate = useNavigate()
  return (
    <>
      <section className="h-dvh">
        {/* Header */}
        <div className="pt-[30px] px-[16px] flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group">
            <img
              src="assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filter group-hover:invert group-hover:brightness-0"
            />
          </button>
          <h1 className="font-semibold text-xl absolute left-1/2 -translate-x-[50%]">
            Pharmakey Doctors
          </h1>
        </div>

        {/* Result Doctor */}
        <div className="mt-[30px] px-[16px]">
          <h1 className="font-bold">Results</h1>

          {/* Doctor */}
          <div className="mt-[10px] flex flex-col gap-y-5">
            {doctors.map((dcotor, index) => (
              <button
                key={index}
                className="flex items-center justify-between gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:bg-[#FD915A] transition-all duration-300 ease-in-out group">
                <div className="flex items-center  gap-x-3">
                  <img
                    src={`assets/img/${dcotor.doctor_image}`}
                    alt="store_image"
                    className="w-[70px] h-[70px] object-contain rounded-full shadow-lg group-hover:p-1 group-hover:rounded-full group-hover:bg-white transition-all duration-300 ease-in-out"
                  />
                  <div className="flex flex-col gap-y-1 items-start">
                    <h1 className="font-bold group-hover:text-white text-start">
                      {dcotor.name}
                    </h1>
                    <p className="font-semibold text-slate-400 group-hover:text-white text-xs">
                      {dcotor.specialize}
                    </p>
                  </div>
                </div>

                {/* consult */}
                <div className="flex items-center gap-x-2">
                  <img
                    src="assets/img/call.png"
                    alt="star"
                    className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                  />
                  <p className="font-semibold flex flex-col items-start text-slate-400 group-hover:text-white text-xs">
                    Request <span>Consultation</span>
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
