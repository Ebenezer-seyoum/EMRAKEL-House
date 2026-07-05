import { getPublicContent } from "@/lib/cms";
import { SectionPageShell } from "../section-page-shell";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const content = await getPublicContent();
  const galleryImages = content.gallery.map((image) => image.image);

  return (
    <SectionPageShell
      eyebrow="Gallery"
      title="Inside the EMRAKEL house."
      description="Warm lights, seating, murals, plants, and the house atmosphere in one clean gallery."
      image={galleryImages[0] || "/uploads/house/interior-08.jpg"}
    >
      <GalleryClient images={galleryImages.concat(galleryImages.slice(0, 5))} />
    </SectionPageShell>
  );
}
