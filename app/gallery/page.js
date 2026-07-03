import { Footer, Header } from "../shared";
import { getPublicContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const content = await getPublicContent();
  const galleryImages = content.gallery.map((image) => image.image);

  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Gallery</p>
          <h1>A black-and-white EMRAKEL gallery ready for real uploaded images.</h1>
          <p className="pageLead">Gallery images can be updated from the admin dashboard.</p>
        </section>
        <section className="section galleryGrid">
          {galleryImages.concat(galleryImages.slice(0, 2)).map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
