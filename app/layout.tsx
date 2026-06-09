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

import { PostHogProvider } from "@/components/posthog-provider";

import { AppShell } from "@/components/layout/AppShell";

import "@/lib/analytics/posthog";

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
    metadataBase:
      new URL(
        "https://tarkintel.com"
      ),

    title: {
      default:
        "TarkIntel",

      template:
        "%s | TarkIntel",
    },

    description:
      "Live Escape From Tarkov progression intelligence platform featuring tasks, hideout planning, item tracking, Kappa analytics, and progression optimization.",

    keywords: [
      "Escape From Tarkov",
      "Tarkov",
      "Tarkov Tasks",
      "Tarkov Hideout",
      "Tarkov Tracker",
      "Tarkov Progression",
      "Kappa Tracker",
      "Tarkov Items",
      "Tarkov Quest Helper",
      "TarkIntel",
    ],

    authors: [
      {
        name: "TarkIntel",
      },
    ],

    creator:
      "TarkIntel",

    publisher:
      "TarkIntel",

    manifest:
      "/manifest.json",

    applicationName:
      "TarkIntel",

    appleWebApp: {
      capable: true,

      statusBarStyle:
        "black-translucent",

      title: "TarkIntel",
    },

    openGraph: {
      type: "website",

      url: "https://tarkintel.com",

      title:
        "TarkIntel",

      description:
        "Live Escape From Tarkov progression intelligence platform.",

      siteName:
        "TarkIntel",

      images: [
        {
          url: "/og-image.png",

          width: 1200,

          height: 630,

          alt: "TarkIntel",
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        "TarkIntel",

      description:
        "Live Escape From Tarkov progression intelligence platform.",

      images: [
        "/og-image.png",
      ],
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground"
      >
        <PostHogProvider>
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}