import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { StockProvider } from "@/context/StockContext";
import Footer from "@/components/Footer";
import FacebookMessenger from "@/components/FacebookMessenger";

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
          <StockProvider>
            {children}
          </StockProvider>
        </CartProvider>
        <Footer />
        <FacebookMessenger />
      </body>
    </html>
  );
}
