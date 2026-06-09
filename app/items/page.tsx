import {
  Suspense,
} from "react";

import {
  ItemsLoader,
} from "@/components/items/ItemsLoader";

function ItemsFallback() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {Array.from({
        length: 10,
      }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-3xl border border-white/5 bg-white/[0.03]"
        />
      ))}
    </div>
  );
}

export default function ItemsPage() {
  return (
    <Suspense
      fallback={
        <ItemsFallback />
      }
    >
      <ItemsLoader />
    </Suspense>
  );
}