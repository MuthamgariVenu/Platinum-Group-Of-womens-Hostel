import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopContactBar from "@/components/TopContactBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Platinum Women’s Hostel | Best Women’s PG in Hyderabad",
  description:
    "Platinum Women’s Hostel offers safe, clean and premium women’s PG accommodation in Hyderabad with food, security and modern facilities.",

  keywords: [
    "Platinum Women's Hostel",
    "Women's PG in Hyderabad",
    "Ladies PG in Hyderabad",
    "Girls Hostel Hyderabad",
    "Women PG near me",
    "Affordable Women's PG Hyderabad",
  ],

  openGraph: {
    title: "Platinum Women’s Hostel | Best Women’s PG in Hyderabad",
    description:
      "Safe, clean and premium women’s PG in Hyderabad with food, security and modern facilities.",
    url: "https://platinum-group-of-womens-hostel.vercel.app",
    siteName: "Platinum Group Of Women’s Hostel",
    locale: "en_IN",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* HEADER (same as Sai Baba pattern) */}
        <TopContactBar />

        {/* PAGE CONTENT */}
        {children}
      </body>
    </html>
  );
}
