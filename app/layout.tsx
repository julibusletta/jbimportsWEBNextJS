import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import ViewportHandler from "./components/ViewportHandler/ViewportHandler";
import { AnimationInitializer } from "./components/AnimationInitializer/AnimationInitializer";
import Header from "./components/Header/Header";
import LogosMarquee from "./components/LogosMarquee/LogosMarquee";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import ConditionalLayout from "./components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
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
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <ViewportHandler />
        <AnimationInitializer />
        <CartProvider>
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
