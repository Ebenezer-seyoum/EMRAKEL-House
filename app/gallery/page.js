import { Footer, Header } from "../shared";
import { getPublicContent } from "@/lib/cms";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const content = await getPublicContent();
  const galleryImages = content.gallery.map((image) => image.image);

  return (
    <>
      <Header
        brandData={content.brand}
        heroKicker="Gallery"
        heroTitle="Inside the EMRAKEL house."
        heroText="Warm lights, seating, murals, plants, and the house atmosphere in one clean gallery."
      />
      <main>
        <GalleryClient images={galleryImages.concat(galleryImages.slice(0, 5))} />
      </main>
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
