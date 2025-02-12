import { Link } from 'react-router-dom'

export const ExploreDoctor = () => {
  return (
    <>
      <div className="pt-[30px] px-[16px]">
        <div className="relative w-full">
          <img
            src="assets/img/bg-doctor.png"
            alt="bg-doctor"
            className="w-full"
          />
          <div className="absolute top-[50px] left-[20px]">
            <h1 className="flex flex-col font-bold leading-tight text-[20px] mb-5">
              Explore great doctors <span>for your better life</span>
            </h1>
            <Link
              to="/doctors"
              className="py-2 px-9 bg-white rounded-[50px] font-bold text-[#FD915A] shadow-xl  hover:text-white hover:bg-[#FD915A] transition-all duration-300 ease-in-out"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
