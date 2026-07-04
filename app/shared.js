import Link from "next/link";
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

export function Header({ brandData = brand, variant = "" }) {
  const headerClassName = variant === "homeHero" ? "siteHeader homeHeroHeader" : "siteHeader";

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
          <Link className="button buttonLine compact bookHeaderButton" href="/book-table">
            Book a Table
          </Link>
          <Link className="button buttonLine compact loginHeaderButton" href="/login">
            Login
          </Link>
          <Link className="navCartButton" href="/menu" aria-label="Open menu cart">
            <span className="cartGlyph" />
            <small>Cart</small>
          </Link>
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
