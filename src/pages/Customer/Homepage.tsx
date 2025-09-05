import { Header } from "../../components/Customer/Header"
import { Hero } from "../../components/Customer/Hero"
import { Categories } from "../../components/Customer/Categories"
import { LatestProducts } from "../../components/Customer/LatestProducts"
import { ExploreDoctor } from "../../components/Customer/ExploreDoctor"
import { MostPurchased } from "../../components/Customer/MostPurchased"
import { Navbar } from "../../components/Customer/Navbar"

export default function Homepage() {
  return (
    <>
      <section>
        <Header />
      </section>

      <section>
        <Hero />
      </section>

      <section>
        <Categories />
      </section>

      <section>
        <LatestProducts />
      </section>

      <section>
        <ExploreDoctor />
      </section>

      <section>
        <MostPurchased />
      </section>

      <section>
        <Navbar />
      </section>
    </>
  )
}
