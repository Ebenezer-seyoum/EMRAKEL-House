import { Footer, Header } from "../shared";

export default function AdminPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Admin dashboard</p>
          <h1>Simple inputs for homepage, menu, gallery, bookings, and orders.</h1>
          <p className="pageLead">
            This page is the admin direction. The migration already includes the tables needed to turn each panel into
            live edit forms.
          </p>
        </section>
        <section className="section adminGrid">
          {[
            "Homepage text and hero media",
            "Menu categories and menu items",
            "Gallery images",
            "Contact and opening hours",
            "Table bookings",
            "Online orders"
          ].map((title) => (
            <div className="panel" key={title}>
              <h2>{title}</h2>
              <p className="contactText">Ready for database-connected admin inputs.</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
