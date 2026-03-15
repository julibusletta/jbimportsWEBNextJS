import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import ViewportHandler from "./components/ViewportHandler/ViewportHandler";
import { AnimationInitializer } from "./components/AnimationInitializer/AnimationInitializer";
import Header from "./components/Header/Header";
import LogosMarquee from "./components/LogosMarquee/LogosMarquee";
import Footer from "./components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JBimports - Tecnología a un solo clic",
  description: "Los mejores productos de tecnología al mejor precio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ViewportHandler />
        <AnimationInitializer />
        <CartProvider>
          <Header />
          {children}
          <LogosMarquee />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
