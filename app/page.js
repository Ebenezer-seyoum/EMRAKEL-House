import Link from "next/link";
import { Header } from "./shared";
import { brandImage } from "@/lib/data";
import { getPublicContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublicContent();
  const heroImage = content.home.heroImage || brandImage;
  const featureBadges = [
    ["Premium", "Burgers"],
    ["Stone-style", "Pizza"],
    ["Crafted", "Cocktails"],
    ["Live", "Jazz Nights"]
  ];

  return (
    <>
      <Header brandData={content.brand} variant="homeHero" />
      <main className="referenceHome">
        <section className="refHero">
          <div className="heroBrandImage" aria-hidden="true">
            <img src={heroImage} alt="" />
          </div>
          <div className="heroShade" />
          <div className="refHeroContent">
            <p className="refWelcome">Welcome to</p>
            <h1>EMRAKEL</h1>
            <p className="refSubtitle">Burger, Pizza &amp; Cocktail House</p>
            <div className="refFeatureRow">
              {featureBadges.map(([top, bottom]) => (
                <div className="refFeature" key={top}>
                  <span aria-hidden="true" />
                  <strong>{top}</strong>
                  <small>{bottom}</small>
                </div>
              ))}
            </div>
            <div className="refHeroActions">
              <Link className="button buttonGold" href="/menu">
                View Menu <span>&gt;</span>
              </Link>
              <Link className="button buttonGhost" href="/gallery">Gallery</Link>
              <Link className="button buttonGhost" href="/about">About Us</Link>
              <Link className="button buttonGhost" href="/contact">Contact</Link>
            </div>
          </div>
        </section>

        <section className="homeJazzOnly">
          <article className="refJazzCard">
            <img src={content.jazz?.image || "/uploads/house/jazz-night.png"} alt="" />
            <div>
              <p>{content.jazz?.eyebrow || "Live Performance"}</p>
              <h2>Jazz Night</h2>
              <span>{content.jazz?.date || "Every Saturday"}</span>
              <span>{content.jazz?.time || "7:00 PM - 10:00 PM"}</span>
              <Link href="/contact">Call to Reserve</Link>
            </div>
          </article>
        </section>

        <footer className="refHomeFooter">
          <div className="refFooterBrand">
            <p>EMRAKEL Burger, Pizza &amp; Cocktail House</p>
            <span>Designed &amp; Developed by Eyoben Technologies PLC</span>
          </div>
          <nav>
            <strong>Quick Links</strong>
            <Link href="/">Home</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/book-table">Book Table</Link>
          </nav>
          <div className="refFooterSocial">
            <strong>Social Media</strong>
            <span>f</span>
            <span>ig</span>
            <span>wa</span>
          </div>
          <div className="refFooterContact">
            <strong>Contact</strong>
            <p>{content.brand.phone}</p>
            <p>{content.brand.address}</p>
            <p>Copyright 2026 EMRAKEL Burger, Pizza &amp; Cocktail House</p>
          </div>
        </footer>
      </main>
    </>
  );
}
