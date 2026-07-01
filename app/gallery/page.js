import { Footer, Header } from "../shared";
import { galleryImages } from "@/lib/data";

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Gallery</p>
          <h1>A warm house atmosphere for lunch, dinner, and late drinks.</h1>
          <p className="pageLead">The gallery is ready to connect to admin uploads through Supabase Storage.</p>
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
