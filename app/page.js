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
  const visibleGallery = galleryImages.slice(0, 5);

  return (
    <>
      <Header brandData={content.brand} />
      <main>
        <section className="hero luxuryHero">
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

        <section className="section introGrid houseIntro">
          <div>
            <p className="eyebrow">Inside the house</p>
            <h2>Dark ceilings, warm lights, green details, and a restaurant mood that feels like EMRAKEL.</h2>
          </div>
          <p>
            The public website now uses the real interior images as the visual identity. Admin updates can replace the
            words and images at any time without changing the layout.
          </p>
        </section>

        <section className="section featureSplit">
          <img src={content.home.featureImage || visibleGallery[0]} alt="" />
          <div>
            <p className="eyebrow">House experience</p>
            <h2>Designed for burgers, pizza, cocktails, and relaxed evenings.</h2>
            <p>
              Warm chandelier light, mural walls, black marble counters, and plant details create a recognizable
              restaurant atmosphere across the site.
            </p>
          </div>
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

        {content.jazz?.enabled ? (
          <section className="section jazzBand">
            <div>
              <p className="eyebrow">{content.jazz.eyebrow}</p>
              <h2>{content.jazz.title}</h2>
              <p>{content.jazz.description}</p>
              <div className="jazzMeta">
                <span>{content.jazz.date}</span>
                <span>{content.jazz.time}</span>
              </div>
            </div>
            <img src={content.jazz.image} alt="" />
          </section>
        ) : null}

        <section className="section galleryStrip animatedGalleryStrip">
          {visibleGallery.map((image, index) => (
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
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
