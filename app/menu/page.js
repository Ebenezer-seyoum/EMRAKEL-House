import { getPublicContent } from "@/lib/cms";
import MenuOrderClient from "./MenuOrderClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const content = await getPublicContent();

  return (
    <main>
      <MenuOrderClient categories={content.categories} items={content.items} />
    </main>
  );
}
