import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWA } from "@/components/PWA";

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
      </body>
    </html>
  );
}
