import "./globals.css";
import { Geist_Mono } from "next/font/google";
import { PWA } from "@/components/PWA";
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from "next";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cat Health Tracker",
  description: "Track your cats' health, weight, nutrition, and vet visits",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-icon.png",
    },
  ],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#6C50E9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PWA />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
