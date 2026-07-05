import "./globals.css";

export const metadata = {
  title: "EMRAKEL | Burger, Pizza & Cocktail House",
  description: "Order burgers, pizza, cocktails, and house favorites from EMRAKEL. Book a table, explore the menu, and enjoy a modern restaurant experience.",
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
