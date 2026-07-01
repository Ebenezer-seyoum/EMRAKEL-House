"use client";

import { useState } from "react";
import { Footer, Header } from "../shared";

export default function LoginPage() {
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("Supabase Auth is ready to connect after adding env keys. Admin and customer login share this screen.");
  }

  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Customer and admin login</p>
          <h1>Professional account access for bookings, orders, and admin content.</h1>
        </section>
        <section className="section formWrap">
          <div className="panel">
            <h2>Login purpose</h2>
            <p className="contactText">
              Customers can track orders and bookings. Admin users can manage homepage text, images, menu items,
              gallery, contact details, bookings, and online orders.
            </p>
          </div>
          <div className="formPanel">
            <form onSubmit={handleSubmit}>
              <label>
                Email
                <input name="email" type="email" required placeholder="you@example.com" />
              </label>
              <label>
                Password
                <input name="password" type="password" required placeholder="Password" />
              </label>
              <button className="button buttonGold" type="submit">
                Login
              </button>
              {status ? <p className="contactText">{status}</p> : null}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
