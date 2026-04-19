import nextPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placecats.com",
      },
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  },
  turbopack: {},
};

export default nextPWA({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
