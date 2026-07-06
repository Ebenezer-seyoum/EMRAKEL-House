import { getPublicContent } from "@/lib/cms";
import Link from "next/link";
import MenuOrderClient from "./MenuOrderClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const content = await getPublicContent();

  return (
    <main className="sectionDetailPage">
      <section className="sectionDetailBackOnly">
        <Link className="sectionBackLink" href="/">
          {content.home.backHomeLabel}
        </Link>
      </section>
      <MenuOrderClient categories={content.categories} defaultSectionImage={content.home.menuPreviewImage} items={content.items} menuBoard={content.menuBoard} />
    </main>
  );
}
