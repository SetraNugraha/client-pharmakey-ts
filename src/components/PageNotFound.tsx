export function PageNotFound() {
  return (
    <section className="h-screen max-w-md mx-auto">
      <div className="h-full flex flex-col items-center justify-center bg-slate-100">
        <h1 className="font-bold text-8xl">404</h1>
        <h1 className="font-bold text-2xl text-slate-500">Page Not Found</h1>
        <a
          href="/"
          className="mt-5 font-semibold text-white px-3 py-2 bg-[#FD915A] rounded-2xl shadow-lg shadow-gray-400 hover:outline-none hover:ring-2 hover:ring-[#FD915A] hover:bg-white hover:text-[#FD915A] transition-all duration-300"
        >
          Go to pharmakey hompage
        </a>
      </div>
    </section>
  );
}
