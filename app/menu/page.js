import { Footer, Header } from "../shared";
import { menuCategories, menuItems } from "@/lib/data";
import MenuOrderClient from "./MenuOrderClient";

export default function MenuPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Order online</p>
          <h1>Choose your EMRAKEL order in a clean black-and-white menu.</h1>
          <p className="pageLead">
            Item names, prices, descriptions, and images stay data-driven for admin updates. The logo is only the
            fallback image until real menu photos are uploaded.
          </p>
        </section>
        <MenuOrderClient categories={menuCategories} items={menuItems} />
      </main>
      <Footer />
    </>
  );
}
