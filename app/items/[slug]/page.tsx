import Link from "next/link";

import {
  getItemBySlug,
  getItemPriority,
  getModulesByItem,
} from "@/lib/item-intelligence";

interface ItemPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ItemPage({
  params,
}: ItemPageProps) {
  const { slug } = await params;

  const item =
    getItemBySlug(slug);

  if (!item) {
    return (
      <div className="min-h-screen bg-background p-4 text-white">
        <h1 className="text-2xl font-bold">
          Item not found
        </h1>
      </div>
    );
  }

  /*
    LIVE INTELLIGENCE
  */

  const priority =
    getItemPriority(item.id);

  /*
    HIDEOUT USAGE
  */

  const relatedModules =
    getModulesByItem(
      item.id
    );

  return (
    <div className="min-h-screen bg-background p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-sm text-zinc-500">
            TarkIntel Item Database
          </p>

          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {item.name}
            </h1>

            <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
              {priority}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              {item.category}
            </div>

            {item.fleaBanned && (
              <div className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-400">
                FLEA BANNED
              </div>
            )}
          </div>
        </div>

        {/* Intelligence */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-green-400">
                Item Intelligence
              </h2>

              <p className="text-sm text-zinc-400">
                Live progression
                analysis
              </p>
            </div>

            <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
              KEEP
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-black/20 p-3">
              <p className="text-xs text-zinc-500">
                Hideout Usage
              </p>

              <h3 className="mt-1 text-xl font-bold">
                {
                  relatedModules.length
                }
              </h3>
            </div>

            <div className="rounded-xl bg-black/20 p-3">
              <p className="text-xs text-zinc-500">
                Avg Price
              </p>

              <h3 className="mt-1 text-xl font-bold text-green-400">
                ₽
                {item.avgPrice?.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Hideout Usage */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Hideout Usage
            </h2>

            <span className="text-sm text-zinc-500">
              Module Requirements
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {relatedModules.length >
            0 ? (
              relatedModules.map(
                (module) => (
                  <div
                    key={
                      module.id
                    }
                    className="rounded-xl bg-zinc-900/50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {
                            module.name
                          }
                        </h3>

                        <p className="text-sm text-zinc-500">
                          Hideout Module
                        </p>
                      </div>

                      <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400">
                        HIDEOUT
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="rounded-xl bg-zinc-900/50 p-4 text-sm text-zinc-500">
                No hideout modules
                currently require
                this item.
              </div>
            )}
          </div>
        </div>

        {/* Future Intelligence */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
          <h2 className="text-lg font-semibold text-blue-400">
            Future Intelligence
          </h2>

          <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-400">
            <p>
              • Live Tarkov.dev item
              relationships
            </p>

            <p>
              • Trader barter usage
            </p>

            <p>
              • Crafting recipes
            </p>

            <p>
              • Flea market trends
            </p>

            <p>
              • Progression demand
              forecasting
            </p>
          </div>
        </div>

        {/* Back */}
        <Link
          href="/items"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to Items
        </Link>
      </div>
    </div>
  );
}