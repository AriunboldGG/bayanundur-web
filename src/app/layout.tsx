import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "БАЯН ӨНДӨР - Bayan Undur",
  description: "БАЯН ӨНДӨР - Your trusted electronics store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
