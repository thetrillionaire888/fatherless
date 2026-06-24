import type { Metadata } from "next";
import { Geist, Geist_Mono, UnifrakturCook, IM_Fell_English, EB_Garamond, Noto_Sans_Javanese } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageGate } from "@/components/language-gate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unifraktur = UnifrakturCook({
  variable: "--font-unifraktur",
  subsets: ["latin"],
  weight: "700",
});

const imFell = IM_Fell_English({
  variable: "--font-im-fell",
  subsets: ["latin"],
  weight: "400",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const javanese = Noto_Sans_Javanese({
  variable: "--font-javanese",
  subsets: ["javanese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // Title is controlled at runtime by page.tsx (bilingual). We provide a
  // static default here only for the very first SSR paint / SEO crawlers.
  title: "Rumah Buah Hati — Help the Fatherless in Indonesia",
  description:
    "Answer God's call to care for the fatherless. Donate, visit, and pray for abandoned Christian orphans in Indonesia. Claim God's promise by giving help to the fatherless.",
  keywords: [
    "fatherless",
    "orphan",
    "Indonesia",
    "Yogyakarta",
    "Bantul",
    "Rumah Buah Hati",
    "Christian charity",
    "donate orphans",
    "Telly Panjaitan",
  ],
  authors: [{ name: "Yayasan Rumah Buah Hati" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Rumah Buah Hati — Help the Fatherless in Indonesia",
    description:
      "Answer God's call to care for the fatherless. Donate, visit, and pray for abandoned Christian orphans in Indonesia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unifraktur.variable} ${imFell.variable} ${garamond.variable} ${javanese.variable} antialiased bg-background text-foreground`}
      >
        <LanguageGate>{children}</LanguageGate>
        <Toaster />
      </body>
    </html>
  );
}
