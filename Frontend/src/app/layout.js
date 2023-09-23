import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShopHub - Online Shopping Hub",
  description: "ShopHub - Your Ultimate Online Shopping Hub. Discover a world of convenience and choice with a vast selection of products in fashion, electronics, home decor, beauty, and more. Shop securely and enjoy fast, hassle-free delivery. Join our shopping community today!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}