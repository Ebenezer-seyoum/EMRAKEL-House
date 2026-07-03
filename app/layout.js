import "./globals.css";

export const metadata = {
  title: "EMRAKEL | Burger House",
  description: "Modern black-and-white burger house with table booking and online ordering.",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
