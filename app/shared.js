"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand, brandImage } from "@/lib/data";

const links = [
  ["Home", "/"],
  ["Menu", "/menu"],
  ["Gallery", "/gallery"],
  ["About Us", "/about"],
  ["Contact", "/contact"]
];

function displayBrandName(brandData) {
  const subtitle = brandData.subtitle || "";
  return subtitle ? `${brandData.name} ${subtitle}` : brandData.name;
}

export function Header({
  brandData = brand,
  heroKicker = "",
  heroTitle = "",
  heroText = "",
  rotateStories
}) {
  const headerClassName = "siteHeader homeHeroHeader";
  const [openPanel, setOpenPanel] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [storyIndex, setStoryIndex] = useState(0);
  const houseStories = rotateStories || [
    "A warm house for burgers, pizza, cocktails, and relaxed evenings.",
    "Hand-painted walls, leafy details, and golden light set the room mood.",
    "Guests can scan the menu, choose quickly, and enjoy the house atmosphere.",
    "Built for today with space for future online booking and customer service."
  ];
  const displayText = heroText || houseStories[storyIndex];

  useEffect(() => {
    if (heroText || houseStories.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setStoryIndex((current) => (current + 1) % houseStories.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [heroText, houseStories.length]);

  async function submitHeaderLogin(event) {
    event.preventDefault();
    setLoginStatus("Checking login...");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const data = await response.json();

    if (!response.ok) {
      setLoginStatus(data.error || "Login failed.");
      return;
    }

    localStorage.setItem("emrakelSession", JSON.stringify(data.user));
    window.location.href = data.user.role === "admin" ? "/admin" : "/customer";
  }

  return (
    <>
      <div className="topSupportBar">
        <span>Customer Support -</span>
        <a href="tel:+251991486512">+251991486512</a>
      </div>
      <header className={headerClassName}>
        <Link className="brandMark" href="/" aria-label="EMRAKEL home">
          <span className="logoShell">
            <img src={brandImage} alt="" />
          </span>
          <span className="brandText">
            <strong>{brandData.name}</strong>
            <small>{brandData.subtitle}</small>
          </span>
        </Link>
        <nav>
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="navActions">
          <div className="headerDropdownWrap">
            <button
              className="button buttonLine compact bookHeaderButton"
              onClick={() => setOpenPanel(openPanel === "book" ? "" : "book")}
              type="button"
            >
              Book a Table
            </button>
            {openPanel === "book" ? (
              <div className="headerDropdownPanel bookingDropdown">
                <p className="dropdownEyebrow">Reserve by phone</p>
                <strong>{brandData.phone}</strong>
                <a className="button buttonGold compact" href={`tel:${brandData.phone.replace(/\s/g, "")}`}>
                  Call Now
                </a>
                <p>Online table booking is prepared for the next upgrade. For now, call us and we will reserve your seat.</p>
              </div>
            ) : null}
          </div>
          <div className="headerDropdownWrap">
            <button
              className="button buttonLine compact loginHeaderButton"
              onClick={() => setOpenPanel(openPanel === "login" ? "" : "login")}
              type="button"
            >
              Login
            </button>
            {openPanel === "login" ? (
              <div className="headerDropdownPanel loginDropdown">
                <p className="dropdownEyebrow">Admin access</p>
                <form onSubmit={submitHeaderLogin}>
                  <label>
                    Email
                    <input name="email" required type="email" placeholder="admin@emrakel.com" />
                  </label>
                  <label>
                    Password
                    <input name="password" required type="password" placeholder="Password" />
                  </label>
                  <button className="button buttonGold compact" type="submit">
                    Login
                  </button>
                </form>
                {loginStatus ? <p>{loginStatus}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className="heroRotatingText" aria-live="polite">
          {heroKicker ? <small>{heroKicker}</small> : null}
          {heroTitle ? <strong>{heroTitle}</strong> : null}
          <span>{displayText}</span>
        </div>
      </header>
    </>
  );
}

export function Footer({ brandData = brand, footerData }) {
  const fullBrandName = displayBrandName(brandData);
  const copyrightText =
    footerData?.copyright === "Copyright 2026 EMRAKEL. All rights reserved."
      ? `Copyright 2026 ${fullBrandName}. All rights reserved.`
      : footerData?.copyright || `Copyright 2026 ${fullBrandName}. All rights reserved.`;

  return (
    <footer className="footer">
      <div className="footerBrand">
        <img src={brandImage} alt="" />
        <div>
          <h2>{fullBrandName}</h2>
          <p>{brandData.subtitle}</p>
          <p>Premium burgers, stone-style pizza, crafted cocktails, and warm house hospitality.</p>
        </div>
      </div>
      <div>
        <h3>Visit</h3>
        <p>{brandData.address}</p>
        <p>{brandData.hours}</p>
      </div>
      <div>
        <h3>Contact</h3>
        <p>{brandData.phone}</p>
        <p>{brandData.email}</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
        <Link href="/book-table">Book Table</Link>
      </div>
      <div>
        <h3>Social</h3>
        <div className="footerSocial">
          <a href="#" aria-label="Facebook"><span>f</span> Facebook</a>
          <a href="#" aria-label="Instagram"><span>ig</span> Instagram</a>
          <a href="#" aria-label="WhatsApp"><span>wa</span> WhatsApp</a>
        </div>
      </div>
      <div className="copyright">
        <p>{copyrightText}</p>
        <p>{footerData?.note || "Designed & Developed by Eyoben Technologies PLC"}</p>
      </div>
    </footer>
  );
}
