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
        <MenuOrderClient categories={content.categories} items={content.items} />
      </main>
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
