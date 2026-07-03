import Link from "next/link";
import { brand, brandImage } from "@/lib/data";

const links = [
  ["Home", "/"],
  ["Menu", "/menu"],
  ["Gallery", "/gallery"],
  ["About Us", "/about"],
  ["Contact", "/contact"]
];

export function Header({ brandData = brand }) {
  return (
    <header className="siteHeader">
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
        <a className="headerPhone" href={`tel:${brandData.phone}`}>
          <span />
          {brandData.phone}
        </a>
        <Link className="button buttonLine compact bookHeaderButton" href="/book-table">
          Book a Table
        </Link>
        <Link className="cartButton" href="/menu" aria-label="Cart">
          Cart<span>3</span>
        </Link>
      </div>
    </header>
  );
}

export function Footer({ brandData = brand, footerData }) {
  return (
    <footer className="footer">
      <div className="footerBrand">
        <img src={brandImage} alt="" />
        <div>
          <h2>{brandData.name}</h2>
          <p>{brandData.subtitle}</p>
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
      </div>
      <div className="copyright">
        <p>{footerData?.copyright || "Copyright 2026 EMRAKEL. All rights reserved."}</p>
        <p>{footerData?.note || "Designed & Developed by Eyoben Technologies PLC"}</p>
      </div>
    </footer>
  );
}
