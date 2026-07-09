import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import CookieBanner from "@/components/CookieBanner";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: "300",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OJARA | Magnify Your Intention",
  description:
    "OJARA offers sacred crystals and spiritual objects — pyrite for wealth, evil eye for protection, chakra trees, jade coins, and Vastu talismans. Rooted in Ojas, the ancient essence of vital energy, each piece is cleansed and charged to attract abundance, protect your aura, and magnify your intent.",
  openGraph: {
    title: "OJARA | Magnify Your Intention",
    description:
      "Sacred crystals and manifestation objects, cleansed and charged to attract abundance, protect your aura, and magnify your intent.",
    siteName: "OJARA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <Marquee />
        <main className="flex-1 bg-ivory">{children}</main>
        <Footer />
        <CartDrawer />
        <FloatingChatWidget />
        <CookieBanner />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#071a47",
              color: "#f7f3eb",
              border: "1px solid rgba(214, 175, 122, 0.4)",
              borderRadius: "9999px",
            },
          }}
        />
      </body>
    </html>
  );
}
