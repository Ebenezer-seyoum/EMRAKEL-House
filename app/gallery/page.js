import { getPublicContent } from "@/lib/cms";
import { SectionPageShell } from "../section-page-shell";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const content = await getPublicContent();
  const galleryImages = content.gallery.map((image) => image.image);

  return (
    <SectionPageShell
      eyebrow={content.home.galleryEyebrow}
      title={content.home.galleryHeadline}
      description={content.home.galleryDescription}
      image={galleryImages[0] || content.home.galleryPreviewImage}
      backLabel={content.home.backHomeLabel}
    >
      <GalleryClient images={galleryImages} />
    </SectionPageShell>
  );
}
