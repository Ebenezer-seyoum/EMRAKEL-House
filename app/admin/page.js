import { Footer, Header } from "../shared";
import AdminDashboardClient from "./AdminDashboardClient";

export default function AdminPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Admin dashboard</p>
          <h1>Control the text, images, bookings, and orders behind EMRAKEL.</h1>
          <p className="pageLead">
            Edit homepage text, menu items, gallery images, table bookings, and online orders from one organized panel.
          </p>
        </section>
        <AdminDashboardClient />
      </main>
      <Footer />
    </>
  );
}
