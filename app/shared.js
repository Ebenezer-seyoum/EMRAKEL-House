import Link from "next/link";
import { brand } from "@/lib/data";

const links = [
  ["Home", "/"],
  ["Menu", "/menu"],
  ["Gallery", "/gallery"],
  ["About Us", "/about"],
  ["Contact", "/contact"]
];

export function Header() {
  return (
    <header className="siteHeader">
      <Link className="brandMark" href="/" aria-label="EMRAKEL home">
        <span className="logoShell">
          <img src="/logo.png" alt="" />
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
        <Link className="button buttonGold compact" href="/book-table">
          Book a Table
        </Link>
        <Link className="button buttonLine compact" href="/login">
          Login
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footerBrand">
        <img src="/logo.png" alt="" />
        <div>
          <h2>{brand.name}</h2>
          <p>{brand.subtitle}</p>
        </div>
      </div>
      <div>
        <h3>Visit</h3>
        <p>{brand.address}</p>
        <p>{brand.hours}</p>
      </div>
      <div>
        <h3>Contact</h3>
        <p>{brand.phone}</p>
        <p>{brand.email}</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>
      <p className="copyright">Copyright 2026 EMRAKEL. All rights reserved.</p>
    </footer>
  );
}
