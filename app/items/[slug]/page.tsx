import Link from "next/link";

import {
  getItemPriority,
  getTasksByItem,
} from "@/lib/item-intelligence";

import {
  createItemSlug,
} from "@/lib/item-slug";

import { getItems } from "@/lib/item-provider";

import {
  ItemTrackerCard,
} from "@/components/items/ItemTrackerCard";

interface ItemPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ItemPage({
  params,
}: ItemPageProps) {
  const { slug } =
    await params;

  /*
    LIVE ITEMS
  */

  const items =
    await getItems();

  /*
    ITEM LOOKUP
  */

  const item =
    items.find(
      (entry) =>
        createItemSlug(
          entry.name
        ) === slug
    );

  if (!item) {
    return (
      <div className="min-h-screen p-4 text-white">
        <h1 className="text-2xl font-bold">
          Item not found
        </h1>
      </div>
    );
  }

  /*
    LIVE TASK
    INTELLIGENCE
  */

  const relatedTasks =
    await getTasksByItem(
      item.name
    );

  /*
    PRIORITY
  */

  const priority =
    await getItemPriority(
      item.name
    );

  /*
    KEEP / SELL
    RECOMMENDATION
  */

  const shouldKeep =
    relatedTasks.length > 0 ||
    item.requiredForHideout;

  /*
    TOTAL REQUIRED
  */

  const totalRequired =
    item.category ===
    "weapon"
      ? relatedTasks.length
      : relatedTasks.reduce(
          (
            total,
            entry
          ) =>
            total +
            Math.min(
              entry.amount || 1,
              10
            ),
          0
        ) +
        (
          item.totalHideoutRequired ??
          0
        );

  /*
    COMBAT ITEMS
  */

  const isCombatItem =
    item.category ===
      "weapon" ||
    item.category ===
      "ammo" ||
    item.category ===
      "armor";

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header */}
      <div className="glass-card rounded-[2rem] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          TarkIntel Intelligence
        </p>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {/* Icon */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
              {item.icon ? (
                <img
                  src={
                    item.icon
                  }
                  alt={
                    item.name
                  }
                  className="h-14 w-14 object-contain"
                />
              ) : (
                <div className="text-3xl text-zinc-600">
                  ⬢
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0">
              <h1 className="text-4xl font-black tracking-tight">
                {item.name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <div className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                  {
                    item.category
                  }
                </div>

                {item.fleaBanned && (
                  <div className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-400">
                    FLEA BANNED
                  </div>
                )}

                {item.requiredForHideout && (
                  <div className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
                    HIDEOUT
                  </div>
                )}

                <div
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    priority ===
                    "EXTREMELY HIGH"
                      ? "bg-red-500/15 text-red-400"
                      : priority ===
                          "HIGH"
                      ? "bg-yellow-500/15 text-yellow-400"
                      : priority ===
                          "MEDIUM"
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-green-500/15 text-green-400"
                  }`}
                >
                  {priority}
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="shrink-0 text-right">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Avg Price
            </p>

            <h2 className="mt-2 text-3xl font-black text-primary">
              ₽
              {item.avgPrice?.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      {/* Intelligence */}
      <div
        className={`rounded-[2rem] border p-5 ${
          shouldKeep
            ? "border-green-500/20 bg-green-500/5"
            : "border-red-500/20 bg-red-500/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-xl font-bold ${
                shouldKeep
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {shouldKeep
                ? "KEEP"
                : "SELL"}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Live progression
              recommendation
              based on task and
              hideout intelligence.
            </p>
          </div>

          <div
  className={`rounded-full px-4 py-2 text-sm font-semibold ${
    shouldKeep
      ? "bg-green-500/15 text-green-400"
      : "bg-red-500/15 text-red-400"
  }`}
>
  {Math.max(
    0,
    totalRequired -
      (item.totalHideoutRequired
        ? 2
        : 0)
  )}{" "}
  REQUIRED
</div>
        </div>
      </div>

      {/* Physical Item Tracker */}
      {totalRequired > 0 &&
        !isCombatItem && (
          <ItemTrackerCard
  itemId={item.id}
  itemName={item.name}
  requiredAmount={totalRequired}
  requiredForHideout={
    item.requiredForHideout
  }
  totalHideoutRequired={
    item.totalHideoutRequired
  }
  totalTaskRequired={relatedTasks.reduce(
    (total, entry) =>
      total +
      Math.min(
        entry.amount || 1,
        10
      ),
    0
  )}
  firTaskRequired={relatedTasks
    .filter(
      (entry) =>
        entry.task
          ?.kappaRequired
    )
    .reduce(
      (total, entry) =>
        total +
        (entry.amount || 1),
      0
    )}
  relatedTasks={relatedTasks.map(
    (entry) => ({
      id: entry.task.id,
      name: entry.task.name,
    })
  )}
  hideoutModules={
    item.hideoutModules ||
    []
  }
  hideoutRequirements={
    item.hideoutRequirements ||
    []
  }
/>
        )}

      {/* Combat Progression */}
      {relatedTasks.length >
        0 &&
        isCombatItem && (
          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Combat
                  Progression
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {
                    relatedTasks.length
                  }{" "}
                  Tasks
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  This item is
                  used for
                  combat-related
                  progression
                  tasks.
                </p>
              </div>

              <div className="rounded-full bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-400">
                COMBAT
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {relatedTasks.map(
                (entry) => (
                  <div
                    key={
                      entry.task
                        .id
                    }
                    className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">
                          {
                            entry
                              .task
                              .name
                          }
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          Weapon /
                          combat
                          task
                        </p>
                      </div>

                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {
                          entry.amount
                        }{" "}
                        kills
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-zinc-500">
            Related Tasks
          </p>

          <h2 className="mt-3 text-4xl font-black text-primary">
            {
              relatedTasks.length
            }
          </h2>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-zinc-500">
            Avg Market Price
          </p>

          <h2 className="mt-3 text-3xl font-black text-green-400">
            ₽
            {item.avgPrice?.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Task Usage */}
      <div className="glass-card rounded-[2rem] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">
              Task Usage
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Live task
              relationships
              from Tarkov.dev
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {relatedTasks.length >
          0 ? (
            relatedTasks.map(
              (
                entry
              ) => (
                <Link
                  key={
                    entry.task.id
                  }
                  href={`/tasks/${entry.task.id}`}
                >
                  <div className="glass-card glass-hover rounded-2xl border border-white/5 p-4 transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {
                            entry
                              .task
                              .name
                          }
                        </h3>

                        <p className="mt-2 text-sm text-zinc-500">
                          {
                            entry
                              .task
                              .trader
                          }
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {entry.task
                          .kappaRequired && (
                          <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-400">
                            KAPPA
                          </div>
                        )}

                        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {entry.task.xp?.toLocaleString()}{" "}
                          XP
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-sm text-zinc-500">
              No live task
              relationships
              found for this
              item.
            </div>
          )}
        </div>
      </div>

      {/* Future Intelligence */}
      <div className="glass-card rounded-[2rem] p-5">
        <h2 className="text-2xl font-black">
          Future Intelligence
        </h2>

        <div className="mt-5 flex flex-col gap-3 text-sm text-zinc-400">
          <p>
            • Hideout module
            requirement
            tracking
          </p>

          <p>
            • Live flea market
            trends
          </p>

          <p>
            • Crafting recipe
            analysis
          </p>

          <p>
            • Progression demand
            forecasting
          </p>

          <p>
            • Keep / sell
            optimization
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
  );
}