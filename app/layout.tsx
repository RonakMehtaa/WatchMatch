import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "WatchMatch - Find Your Next Watch Together",
  description: "Swipe and match movies & shows with friends. Discover what to watch together.",
  keywords: ["movies", "tv shows", "watch together", "streaming", "match"],
  authors: [{ name: "WatchMatch" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-full bg-[#0B0B0F] text-white antialiased" style={{ minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
