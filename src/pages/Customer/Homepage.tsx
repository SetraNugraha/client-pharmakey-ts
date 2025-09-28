import { Header } from "../../components/Customer/Header";
import { Hero } from "../../components/Customer/Hero";
import { Categories } from "../../components/Customer/Categories";
import { LatestProducts } from "../../components/Customer/LatestProducts";
import { ExploreDoctor } from "../../components/Customer/ExploreDoctor";
import { MostPurchased } from "../../components/Customer/MostPurchased";
import { Navbar } from "../../components/Customer/Navbar";
import { useProducts } from "../CustomHooks/useProduct";

export default function Homepage() {
  const { products, isLoading } = useProducts({ limit: 4 });
  return (
    <section>
      <div>
        <Header />
      </div>

      <div>
        <Hero />
      </div>

      <div>
        <Categories />
      </div>

      <div>
        <LatestProducts products={products} isLoading={isLoading} />
      </div>

      <div>
        <ExploreDoctor />
      </div>

      <div>
        <MostPurchased products={products} isLoading={isLoading} />
      </div>

      <div>
        <Navbar />
      </div>
    </section>
  );
}
