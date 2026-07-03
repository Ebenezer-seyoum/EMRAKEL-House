import { Footer, Header } from "../shared";
import { getPublicContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const content = await getPublicContent();
  const galleryImages = content.gallery.map((image) => image.image);

  return (
    <>
      <Header brandData={content.brand} />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Gallery</p>
          <h1>Inside the EMRAKEL house.</h1>
          <p className="pageLead">A moving gallery of murals, warm lights, seating, plants, and evening atmosphere.</p>
        </section>
        <section className="section galleryGrid animatedGallery">
          {galleryImages.concat(galleryImages.slice(0, 2)).map((image, index) => (
            <figure key={`${image}-${index}`}>
              <img src={image} alt="" />
            </figure>
          ))}
        </section>
      </main>
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
