import { Footer, Header } from "../shared";
import { getPublicContent } from "@/lib/cms";
import ContactFormClient from "./ContactFormClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getPublicContent();
  const { brand, contact } = content;

  return (
    <>
      <Header brandData={content.brand} />
      <main>
        <section className="pageHero mediaPageHero">
          <div>
            <p className="eyebrow">{contact.eyebrow}</p>
            <h1>{contact.headline}</h1>
            <p className="pageLead">{contact.description}</p>
          </div>
          <img src={contact.image} alt="" />
        </section>
        <section className="section contactSplit">
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
          </div>
        </section>
      </main>
      <Footer brandData={content.brand} footerData={content.footer} />
    </>
  );
}
