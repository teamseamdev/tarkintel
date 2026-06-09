"use client";

import {
  Suspense,
  useEffect,
} from "react";

import { usePathname, useSearchParams } from "next/navigation";

import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

import posthog from "@/lib/analytics/posthog";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams =
    useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph) {
      let url =
        window.origin + pathname;

      const search =
        searchParams.toString();

      if (search) {
        url += `?${search}`;
      }

      ph.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
