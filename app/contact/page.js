import { getPublicContent } from "@/lib/cms";
import { SectionPageShell } from "../section-page-shell";
import ContactFormClient from "./ContactFormClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getPublicContent();
  const { brand, contact } = content;

  return (
    <SectionPageShell
      eyebrow={contact.eyebrow}
      title={contact.headline}
      description={contact.description}
      image={contact.image}
    >
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
    </SectionPageShell>
  );
}
