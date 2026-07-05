import "./globals.css";
import { getPublicContent } from "@/lib/cms";

function normalizeSiteUrl(value) {
  const rawValue = value || "https://www.httpemrakelhouse.com";
  const withProtocol = /^https?:\/\//i.test(rawValue) ? rawValue : `https://${rawValue}`;

  try {
    return new URL(withProtocol).toString().replace(/\/$/, "");
  } catch {
    return "https://www.httpemrakelhouse.com";
  }
}

function absoluteUrl(pathOrUrl, siteUrl) {
  if (!pathOrUrl) {
    return siteUrl;
  }

  try {
    return new URL(pathOrUrl, siteUrl).toString();
  } catch {
    return siteUrl;
  }
}

export async function generateMetadata() {
  const content = await getPublicContent();
  const seo = content.seo || {};
  const siteUrl = normalizeSiteUrl(seo.siteUrl);
  const title = seo.title || "EMRAKEL | Burger, Pizza & Cocktail House";
  const description =
    seo.description ||
    "Order burgers, pizza, cocktails, and house favorites from EMRAKEL. Book a table, explore the menu, and enjoy a modern restaurant experience.";
  const image = absoluteUrl(seo.image || "/logo.png", siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: seo.keywords || undefined,
    alternates: {
      canonical: siteUrl
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: content.brand?.name || "EMRAKEL",
      images: [{ url: image }],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    },
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png"
    }
  };
}

export default async function RootLayout({ children }) {
  const content = await getPublicContent();
  const seo = content.seo || {};
  const siteUrl = normalizeSiteUrl(seo.siteUrl);
  const enabledSitelinks = (seo.sitelinks || []).filter((link) => link.enabled !== false);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: content.brand?.name || "EMRAKEL",
      description: seo.description || content.home?.description,
      url: siteUrl,
      image: absoluteUrl(seo.image || "/logo.png", siteUrl),
      telephone: content.brand?.phone,
      email: content.brand?.email,
      address: content.brand?.address,
      servesCuisine: ["Burgers", "Pizza", "Cocktails"],
      openingHours: content.brand?.hours
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: seo.title || content.brand?.name || "EMRAKEL",
      url: siteUrl
    },
    ...enabledSitelinks.map((link, index) => ({
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: link.label,
      description: link.description,
      url: absoluteUrl(link.url, siteUrl)
    }))
  ];

  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
