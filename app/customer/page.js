"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Footer, Header } from "../shared";

export default function CustomerDashboardPage() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(JSON.parse(localStorage.getItem("emrakelSession") || "null"));
  }, []);

  function logout() {
    localStorage.removeItem("emrakelSession");
    window.location.href = "/login";
  }

  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Customer dashboard</p>
          <h1>Track your EMRAKEL orders and bookings.</h1>
          <p className="pageLead">
            Customer accounts are separated from admin access. Orders and table bookings can be submitted from the
            public pages.
          </p>
        </section>
        <section className="section formWrap">
          <div className="panel">
            <h2>{session?.role === "customer" ? `Welcome, ${session.name}` : "Customer login required"}</h2>
            <p className="contactText">
              Use the menu page to place an order or the booking page to reserve a table. Admin-only content controls
              stay locked away from customer accounts.
            </p>
          </div>
          <div className="panel">
            <div className="actions">
              <Link className="button buttonGold" href="/menu">
                Order Online
              </Link>
              <Link className="button buttonLine" href="/book-table">
                Book a Table
              </Link>
              <button className="button buttonLine" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
