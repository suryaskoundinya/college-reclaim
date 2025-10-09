import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "College Reclaim - Lost & Found",
  description: "A comprehensive platform for managing lost and found items in college communities. Report lost items, help others find their belongings, and build a trustworthy campus network.",
  keywords: "college, lost and found, campus, student services, lost items, found items, university",
  authors: [{ name: "College Reclaim Team" }],
  robots: "index, follow",
  openGraph: {
    title: "College Reclaim - Lost & Found Platform",
    description: "Help your campus community recover lost items with our comprehensive lost and found platform.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
