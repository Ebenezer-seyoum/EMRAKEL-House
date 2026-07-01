"use client";

import { useState } from "react";
import { Footer, Header } from "../shared";

export default function BookTablePage() {
  const [status, setStatus] = useState("");

  async function submitBooking(event) {
    event.preventDefault();
    setStatus("Sending booking...");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setStatus(response.ok ? data.message : data.error);
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Book a table</p>
          <h1>Reserve a warm table for your meal or cocktail night.</h1>
          <p className="pageLead">Customers can book as guests now, and the same table supports customer accounts later.</p>
        </section>
        <section className="section formWrap">
          <div className="panel">
            <h2>Booking flow</h2>
            <p className="contactText">
              The backend stores customer name, phone, email, date, time, guests, and notes. Admin can approve, cancel,
              or mark the booking as completed.
            </p>
          </div>
          <div className="formPanel">
            <form onSubmit={submitBooking}>
              <label>
                Full name
                <input name="customer_name" required placeholder="Customer name" />
              </label>
              <label>
                Phone
                <input name="phone" required placeholder="Phone number" />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="Email address" />
              </label>
              <label>
                Date
                <input name="booking_date" type="date" required />
              </label>
              <label>
                Time
                <input name="booking_time" type="time" required />
              </label>
              <label>
                Guests
                <input name="guests" type="number" min="1" max="30" required defaultValue="2" />
              </label>
              <label>
                Notes
                <textarea name="notes" placeholder="Special request" />
              </label>
              <button className="button buttonGold" type="submit">
                Send Booking
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
