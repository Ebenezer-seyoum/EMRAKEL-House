import Link from "next/link";
import { Footer, Header } from "./shared";
import { brandImage } from "@/lib/data";
import { getPublicContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublicContent();
  const featured = content.items.slice(0, 3);
  const galleryImages = content.gallery.map((image) => image.image);
  const heroImage = content.home.heroImage || brandImage;

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="heroBrandImage" aria-hidden="true">
            <img src={heroImage} alt="" />
          </div>
          <div className="heroShade" />
          <div className="heroContent">
            <p className="eyebrow">{content.home.eyebrow}</p>
            <h1>{content.home.headline}</h1>
            <p>{content.home.description}</p>
            <div className="actions">
              <Link className="button buttonGold" href="/book-table">
                {content.home.primaryAction}
              </Link>
              <Link className="button buttonGhost" href="/menu">
                {content.home.secondaryAction}
              </Link>
            </div>
          </div>
        </section>

        <section className="section introGrid">
          <div>
            <p className="eyebrow">House palette</p>
            <h2>Clean black, bright white, and disciplined spacing for a premium burger brand.</h2>
          </div>
          <p>
            The website now follows the supplied EMRAKEL Burger House logo. Product and gallery images use the logo as
            a default fallback, so future admin uploads can replace them cleanly.
          </p>
        </section>

        <section className="section">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">Favorites</p>
              <h2>House signatures</h2>
            </div>
            <Link href="/menu">Full menu</Link>
          </div>
          <div className="cardGrid">
            {featured.map((item) => (
              <article className="menuCard" key={item.id}>
                <img src={item.image} alt="" />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>{item.price} ETB</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section galleryStrip">
          {galleryImages.map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" />
          ))}
        </section>

        <section className="bookingBand">
          <div>
            <p className="eyebrow">Reserve or order</p>
            <h2>Your table and your meal can start here.</h2>
          </div>
          <div className="actions">
            <Link className="button buttonGold" href="/book-table">
              Book a Table
            </Link>
            <Link className="button buttonDark" href="/menu">
              Order Online
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
