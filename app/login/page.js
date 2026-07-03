"use client";

import { useState } from "react";
import { Footer, Header } from "../shared";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(mode === "login" ? "Checking login..." : "Creating account...");

    const formData = new FormData(event.currentTarget);
    const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error);
      return;
    }

    localStorage.setItem("emrakelSession", JSON.stringify(data.user));
    window.location.href = data.user.role === "admin" ? "/admin" : "/customer";
  }

  return (
    <>
      <Header />
      <main>
        <section className="pageHero">
          <p className="eyebrow">Customer and admin login</p>
          <h1>Secure account access for bookings, orders, and admin content.</h1>
          <p className="pageLead">Admin and customer accounts are managed from the EMRAKEL users table.</p>
        </section>
        <section className="section formWrap">
          <div className="panel">
            <h2>{mode === "login" ? "Login purpose" : "Create customer account"}</h2>
            <p className="contactText">
              Admin users manage homepage text, images, menu items, gallery, bookings, and online orders. Customers
              can register, login, order from the menu, and book a table.
            </p>
          </div>
          <div className="formPanel">
            <div className="authSwitch" aria-label="Account mode">
              <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
                Login
              </button>
              <button
                className={mode === "register" ? "active" : ""}
                type="button"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {mode === "register" ? (
                <>
                  <label>
                    Full name
                    <input name="name" required placeholder="Customer name" />
                  </label>
                  <label>
                    Phone
                    <input name="phone" placeholder="Phone number" />
                  </label>
                </>
              ) : null}
              <label>
                Email
                <input name="email" type="email" required placeholder={mode === "login" ? "admin@emrakel.com" : "you@example.com"} />
              </label>
              <label>
                Password
                <input name="password" type="password" required placeholder={mode === "register" ? "Minimum 8 characters" : "Password"} />
              </label>
              <button className="button buttonGold" type="submit">
                {mode === "login" ? "Login" : "Create Account"}
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
