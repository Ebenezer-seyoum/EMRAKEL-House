import { Footer, Header } from "../shared";
import { getPublicContent } from "@/lib/cms";
import MenuOrderClient from "./MenuOrderClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const content = await getPublicContent();

  return (
    <>
      <Header brandData={content.brand} />
      <main>
        <section className="pageHero">
          <p className="eyebrow">House menu</p>
          <h1>Choose burgers, pizza, shakes, mojito, cocktails, and house favorites.</h1>
          <p className="pageLead">
            Sections, subsections, prices, descriptions, and item images are controlled from the admin dashboard.
          </p>
        </section>
        <MenuOrderClient categories={content.categories} items={content.items} />
      </main>
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
