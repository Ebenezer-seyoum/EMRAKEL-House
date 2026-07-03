import { Footer, Header } from "../shared";
import { getPublicContent } from "@/lib/cms";
import MenuOrderClient from "./MenuOrderClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const content = await getPublicContent();

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
        <MenuOrderClient categories={content.categories} items={content.items} />
      </main>
      <Footer />
    </>
  );
}
