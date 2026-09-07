import type { Metadata } from "next";
import { Noto_Sans_KR, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "VELLUNE | Your Skin, In Its Own Rhythm",
  description:
    "VELLUNE LABS researches the natural rhythm of skin. Discover premium skincare designed around balance, recovery, and everyday comfort.",
  keywords: [
    "VELLUNE",
    "skincare",
    "premium cosmetics",
    "rhythm barrier serum",
    "VELLUNE LABS",
  ],
  metadataBase: new URL("https://www.vellune.com"),
  openGraph: {
    title: "VELLUNE | Your Skin, In Its Own Rhythm",
    description:
      "Premium skincare designed around the natural rhythm of your skin.",
    type: "website",
    locale: "ko_KR",
    siteName: "VELLUNE",
  },
  twitter: {
    card: "summary_large_image",
    title: "VELLUNE | Your Skin, In Its Own Rhythm",
    description:
      "Premium skincare designed around the natural rhythm of your skin.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F5F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} ${notoSansKr.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
