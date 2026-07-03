import Link from "next/link";
import { Footer, Header } from "./shared";
import { brandImage, galleryImages, homeSettings, menuItems } from "@/lib/data";

export default function HomePage() {
  const featured = menuItems.slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="heroBrandImage" aria-hidden="true">
            <img src={brandImage} alt="" />
          </div>
          <div className="heroShade" />
          <div className="heroContent">
            <p className="eyebrow">{homeSettings.eyebrow}</p>
            <h1>{homeSettings.headline}</h1>
            <p>{homeSettings.description}</p>
            <div className="actions">
              <Link className="button buttonGold" href="/book-table">
                {homeSettings.primaryAction}
              </Link>
              <Link className="button buttonGhost" href="/menu">
                {homeSettings.secondaryAction}
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
          {galleryImages.map((image) => (
            <img key={image} src={image} alt="" />
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
