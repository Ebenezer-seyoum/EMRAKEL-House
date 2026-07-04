import "./globals.css";

export const metadata = {
  title: "EMRAKEL | Burger, Pizza & Cocktail House",
  description: "Modern black-and-white burger house with table booking and online ordering.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
