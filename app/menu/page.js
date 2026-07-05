import { getPublicContent } from "@/lib/cms";
import { SectionPageShell } from "../section-page-shell";
import MenuOrderClient from "./MenuOrderClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const content = await getPublicContent();

  return (
    <SectionPageShell
      eyebrow={content.home.menuPageEyebrow}
      title={content.home.menuPageTitle}
      description={content.home.menuPageDescription}
      image={content.home.menuPageImage}
      backLabel={content.home.backHomeLabel}
    >
      <MenuOrderClient categories={content.categories} items={content.items} />
    </SectionPageShell>
  );
}
