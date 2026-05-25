import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import { MobileNav } from "@/components/mobile-nav";

import { AuthProvider } from "@/components/auth-provider";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",

  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",

  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TarkIntel",

  description:
    "Escape From Tarkov Progression Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground">
  <AuthProvider>
    {/* MOBILE */}
    <div className="lg:hidden">
      <main className="mx-auto max-w-lg">
        {children}
      </main>

      <MobileNav />
    </div>

    {/* DESKTOP */}
    <div className="hidden lg:block">
      <div className="mx-auto grid min-h-screen max-w-[1800px] grid-cols-[320px_1fr] gap-6 p-4">
        {/* Sidebar */}
        <DesktopSidebar />

        {/* Content */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  </AuthProvider>
</body>
    </html>
  );
}