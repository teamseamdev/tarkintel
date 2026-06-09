import {
  Suspense,
} from "react";

import {
  PageContainer,
} from "@/components/layout/PageContainer";

import {
  HideoutLoader,
} from "@/components/hideout/HideoutLoader";

function HideoutFallback() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="h-[220px] animate-pulse rounded-[2rem] border border-white/5 bg-white/[0.03]" />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-[140px] animate-pulse rounded-3xl border border-white/5 bg-white/[0.03]" />

          <div className="h-[140px] animate-pulse rounded-3xl border border-white/5 bg-white/[0.03]" />
        </div>

        {/* Planner Skeleton */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[420px] animate-pulse rounded-[2rem] border border-white/5 bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

export default function HideoutPage() {
  return (
    <Suspense
      fallback={
        <HideoutFallback />
      }
    >
      <HideoutLoader />
    </Suspense>
  );
}