import { Link } from 'react-router-dom'

export default function FinishCheckout() {
  return (
    <>
      <section className="h-dvh flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-3 my-auto">
          <img src="assets/img/give-medicine.png" alt="finish order" />
          <h1 className="font-bold text-2xl">Yeay! Order Finished</h1>
          <p className="flex flex-col items-center font-semibold">
            We've received your order, send your proof and then <span>our staff will check them now</span>
          </p>
          <Link
            to="/transactions"
            className="tracking-wider px-6 py-3 bg-[#FD915A] text-white font-bold rounded-[50px] hover:bg-white hover:text-[#FD915A] hover:ring-2 hover:ring-[#FD915A] shadow-xl">
            My Orders
          </Link>
        </div>
      </section>
    </>
  )
}
