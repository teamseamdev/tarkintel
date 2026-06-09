import type {
  Metadata,
  Viewport,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/components/auth-provider";

import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable:
    "--font-geist-sans",

  subsets: ["latin"],
});

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: ["latin"],
  });

/*
  METADATA
*/

export const metadata: Metadata =
  {
    title: "TarkIntel",

    description:
      "Escape From Tarkov Progression Assistant",

    manifest:
      "/manifest.json",

    appleWebApp: {
      capable: true,

      statusBarStyle:
        "black-translucent",

      title: "TarkIntel",
    },

    icons: {
      icon: [
        {
          url: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },

        {
          url: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],

      apple:
        "/icons/icon-512.png",
    },
  };

/*
  VIEWPORT
*/

export const viewport: Viewport =
  {
    themeColor:
      "#05070A",

    viewportFit:
      "cover",

    width:
      "device-width",

    initialScale: 1,

    maximumScale: 1,
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
      <body
  suppressHydrationWarning
  className="min-h-full bg-background text-foreground"
>
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}