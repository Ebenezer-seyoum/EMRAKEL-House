import { getPublicContent } from "@/lib/cms";
import { SectionPageShell } from "../section-page-shell";
import MenuOrderClient from "./MenuOrderClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const content = await getPublicContent();

  return (
    <SectionPageShell
      eyebrow="House menu"
      title="EMRAKEL Menu"
      description="Scan, choose, and enjoy burgers, pizza, shakes, mojito, cocktails, and house favorites."
      image="/uploads/house/interior-08.jpg"
    >
      <MenuOrderClient categories={content.categories} items={content.items} />
    </SectionPageShell>
  );
}
