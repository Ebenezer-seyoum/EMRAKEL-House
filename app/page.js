import { Footer, Header } from "./shared";
import { getPublicContent } from "@/lib/cms";
import MenuOrderClient from "./menu/MenuOrderClient";
import GalleryClient from "./gallery/GalleryClient";
import ContactFormClient from "./contact/ContactFormClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublicContent();
  const { about, brand, contact } = content;
  const galleryImages = content.gallery.map((image) => image.image);

  return (
    <>
      <Header brandData={content.brand} heroKicker="Welcome to" heroTitle="EMRAKEL" />
      <main className="referenceHome">
        <section className="homeJazzOnly" id="home">
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

        <div id="menu" className="homeScrollSection">
          <div className="homeSectionAction">
            <Link className="button buttonGold" href="/menu">
              View More
            </Link>
          </div>
          <MenuOrderClient categories={content.categories} items={content.items} />
        </div>

        <div id="gallery" className="homeScrollSection">
          <div className="homeSectionIntro">
            <p className="eyebrow">Gallery</p>
            <h2>Inside the EMRAKEL house.</h2>
            <p>Warm lights, seating, murals, plants, and the house atmosphere in one clean gallery.</p>
            <Link className="button buttonGold" href="/gallery">
              View More
            </Link>
          </div>
          <GalleryClient images={galleryImages.concat(galleryImages.slice(0, 5))} />
        </div>

        <section id="about" className="section aboutStoryGrid homeScrollSection">
          <div className="aboutStoryImage">
            <img src={about.image} alt="" />
          </div>
          <div className="aboutStoryText">
            <p className="eyebrow">{about.eyebrow}</p>
            <h2>{about.headline}</h2>
            <p className="contactText">{about.description}</p>
            <Link className="button buttonGold" href="/about">
              View More
            </Link>
          </div>
          <div className="aboutStoryImage">
            <img src={about.secondaryImage} alt="" />
          </div>
          <div className="aboutStoryText">
            <p className="eyebrow">Food focus</p>
            <h2>A simple house menu with room to grow.</h2>
            <p className="contactText">
              Burgers, pizza, sandwiches, shawarma, shakes, mojito, and cocktails are arranged clearly for guests while
              the admin dashboard keeps future edits practical.
            </p>
          </div>
        </section>

        <section id="contact" className="section contactSplit homeScrollSection">
          <div className="contactInfoPanel">
            <p className="eyebrow">Contact information</p>
            <h2>{brand.name}</h2>
            <p className="contactText">{brand.address}</p>
            <p className="contactText">{brand.hours}</p>
            <p className="contactText">{brand.phone}</p>
            <p className="contactText">{brand.email}</p>
            <img src={contact.image} alt="" />
          </div>
          <div className="formPanel feedbackPanel">
            <p className="eyebrow">Feedback form</p>
            <h2>Send us a message.</h2>
            <ContactFormClient />
            <Link className="button buttonGold sectionPanelAction" href="/contact">
              View More
            </Link>
          </div>
        </section>
      </main>
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
