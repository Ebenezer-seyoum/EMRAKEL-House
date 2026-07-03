import { Footer, Header } from "../shared";
import { brandImage } from "@/lib/data";

const adminPanels = [
  ["Homepage text", "Headline, eyebrow, action labels, and hero message are ready to map to site_settings."],
  ["Homepage media", "Hero image/video can use uploaded media, with the EMRAKEL logo as the fallback."],
  ["Menu items", "Names, prices, descriptions, categories, availability, and image URLs map to menu tables."],
  ["Gallery images", "Uploaded gallery photos can replace the current logo fallback without code changes."],
  ["Table bookings", "Booking submissions post to /api/bookings and can be approved or cancelled in the database."],
  ["Online orders", "Order submissions post to /api/orders with item quantities and customer details."]
];

export default function AdminPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Admin dashboard</p>
          <h1>Control the text, images, bookings, and orders behind EMRAKEL.</h1>
          <p className="pageLead">
            The database migration includes the tables for live admin editing. Until authentication and form handlers
            are connected, the public site keeps using safe local defaults and logo fallback images.
          </p>
        </section>
        <section className="section adminGrid">
          {adminPanels.map(([title, text]) => (
            <div className="panel" key={title}>
              <img className="adminPanelImage" src={brandImage} alt="" />
              <h2>{title}</h2>
              <p className="contactText">{text}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
