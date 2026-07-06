"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Footer, Header } from "../shared";
import { brand as defaultBrand, customerPageSettings, footerSettings } from "@/lib/data";

export default function CustomerDashboardPage() {
  const [session, setSession] = useState(null);
  const [brand, setBrand] = useState(defaultBrand);
  const [footer, setFooter] = useState(footerSettings);
  const [pageText, setPageText] = useState(customerPageSettings);

  useEffect(() => {
    setSession(JSON.parse(localStorage.getItem("emrakelSession") || "null"));
    fetch("/api/settings")
      .then((response) => response.json())
      .then((data) => {
        setBrand({ ...defaultBrand, ...(data.brand || {}) });
        setFooter({ ...footerSettings, ...(data.footer || {}) });
        setPageText({ ...customerPageSettings, ...(data.customerPage || {}) });
      })
      .catch(() => undefined);
  }, []);

  function logout() {
    localStorage.removeItem("emrakelSession");
    window.location.href = "/login";
  }

  return (
    <>
      <Header brandData={brand} />
      <main>
        <section className="pageHero">
          <p className="eyebrow">{pageText.eyebrow}</p>
          <h1>{pageText.headline}</h1>
          <p className="pageLead">{pageText.description}</p>
        </section>
        <section className="section formWrap">
          <div className="panel">
            <h2>{session?.role === "customer" ? `${pageText.welcomePrefix}, ${session.name}` : pageText.loginRequiredTitle}</h2>
            <p className="contactText">{pageText.panelText}</p>
          </div>
          <div className="panel">
            <div className="actions">
              <Link className="button buttonGold" href="/menu">
                {pageText.orderButtonLabel}
              </Link>
              <Link className="button buttonLine" href="/book-table">
                {pageText.bookButtonLabel}
              </Link>
              <button className="button buttonLine" type="button" onClick={logout}>
                {pageText.logoutButtonLabel}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer brandData={brand} footerData={footer} />
    </>
  );
}
