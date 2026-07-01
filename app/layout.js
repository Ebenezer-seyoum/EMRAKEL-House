import "./globals.css";

export const metadata = {
  title: "EMRAKEL | Burger, Pizza & Cocktail House",
  description: "Classic burger, pizza, and cocktail house with table booking and online ordering.",
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
