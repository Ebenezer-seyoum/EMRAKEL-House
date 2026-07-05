"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookTablePage() {
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState({ customer_name: "", phone: "", email: "" });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("emrakelSession") || "null");
    if (session?.role === "customer") {
      setCustomer({
        customer_name: session.name || "",
        phone: session.phone || "",
        email: session.email || ""
      });
    }
  }, []);

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

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
    <main className="sectionDetailPage">
      <section className="sectionDetailHero">
        <div>
          <Link className="sectionBackLink" href="/">
            Back to home
          </Link>
          <p className="eyebrow">Book a table</p>
          <h1>Reserve a table inside the EMRAKEL black-and-white house.</h1>
          <p className="pageLead">Customers can login first to prefill their details, then send a booking request.</p>
        </div>
      </section>
      <section className="section formWrap">
        <div className="panel">
          <h2>Booking flow</h2>
          <p className="contactText">
            The booking route stores customer name, phone, email, date, time, guests, and notes. Admin can confirm or
            update the request from the dashboard.
          </p>
        </div>
        <div className="formPanel">
          <form onSubmit={submitBooking}>
            <label>
              Full name
              <input
                name="customer_name"
                onChange={(event) => updateCustomer("customer_name", event.target.value)}
                required
                placeholder="Customer name"
                value={customer.customer_name}
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                onChange={(event) => updateCustomer("phone", event.target.value)}
                required
                placeholder="Phone number"
                value={customer.phone}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                onChange={(event) => updateCustomer("email", event.target.value)}
                placeholder="Email address"
                type="email"
                value={customer.email}
              />
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
  );
}
