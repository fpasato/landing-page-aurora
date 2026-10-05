import { Hero } from "./components/hero";
import { Header } from "../../components/header";
import { About } from "./components/about";
import { Products } from "./components/products";
import { Testimonials } from "./components/testimonials";
import { Cta } from "./components/cta";
import { Footer } from "../../components/footer";

export function Home() {
  return (
    <main >
      <Header />
      <Hero />
      <About />
      <Products />
      <Testimonials />
      <Cta />
      <Footer />
    </main>
  );
}