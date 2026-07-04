import Link from "next/link";
import { Header } from "./shared";
import { brandImage, menuItems } from "@/lib/data";
import { getPublicContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublicContent();
  const featured = (content.items.length ? content.items : menuItems).slice(0, 4);
  const heroImage = content.home.heroImage || brandImage;
  const visibleGallery = [
    "/uploads/house/interior-04.jpg",
    "/uploads/house/interior-08.jpg",
    "/uploads/house/interior-03.jpg",
    "/uploads/house/interior-10.jpg",
    "/uploads/house/interior-11.jpg",
    "/uploads/house/interior-06.jpg"
  ];
  const menuTabs = ["Burgers", "Pizza", "Shakes", "Mojito"];
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
              <Link className="button buttonGhost" href="/book-table">
                Book a Table
              </Link>
            </div>
          </div>
        </section>

        <section className="refThumbStrip">
          <div className="refThumbGrid">
            {visibleGallery.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="" />
            ))}
          </div>
          <button aria-label="Next gallery image">&gt;</button>
        </section>

        <section className="refLower">
          <div className="refMenuArea">
            <div className="refSectionHead">
              <h2>Our Menu</h2>
              <Link href="/menu">View Full Menu &gt;</Link>
            </div>
            <div className="refMenuTabs">
              {menuTabs.map((tab, index) => (
                <span className={index === 0 ? "active" : ""} key={tab}>
                  {tab}
                </span>
              ))}
            </div>
            <div className="refMenuCards">
              {featured.map((item) => (
                <article className="refMenuCard" key={item.id}>
                  <img src={item.image || "/uploads/house/menu-board-reference.jpg"} alt="" />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.price} birr</p>
                  </div>
                  <button type="button">+</button>
                </article>
              ))}
            </div>
          </div>

          <div className="refSideCards">
            <article className="refJazzCard">
              <img src="/uploads/house/jazz-night.png" alt="" />
              <div>
                <p>Live Performance</p>
                <h2>Jazz Night</h2>
                <span>{content.jazz?.date || "Every Saturday"}</span>
                <span>{content.jazz?.time || "7:00 PM - 10:00 PM"}</span>
                <Link href="/book-table">Reserve Your Seat</Link>
              </div>
            </article>
            <article className="refBookingCard">
              <h3>Book a Table</h3>
              <p>Reserve your table for a great experience</p>
              <Link href="/book-table">Book Now</Link>
            </article>
            <article className="refContactCard">
              <p>{content.brand.phone}</p>
              <p>{content.brand.address}</p>
            </article>
          </div>
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
