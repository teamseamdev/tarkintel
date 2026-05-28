"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  TarkovItem,
} from "@/types/item";

import {
  createItemSlug,
} from "@/lib/item-slug";

interface ItemsClientProps {
  items: TarkovItem[];
}

export function ItemsClient({
  items,
}: ItemsClientProps) {
  const [search, setSearch] =
    useState("");

  const suggestions =
    useMemo(() => {
      let filtered =
        items;

      if (
        search.trim()
      ) {
        filtered =
          items.filter(
            (item) =>
              item.name
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          );
      }

      return filtered.slice(
        0,
        50
      );
    }, [search, items]);

  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2rem] glass-card p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />

          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Tactical Intelligence
            </p>

            <h1 className="text-gradient mt-3 text-5xl font-black tracking-tight">
              Items
            </h1>

            <p className="mt-3 max-w-sm text-sm text-zinc-400">
              Search barter items,
              task requirements, and
              progression materials.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card rounded-3xl p-5">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-xl font-bold">
                Item Search
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Search Tarkov items
                and progression
                requirements.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-primary/40 focus:bg-white/[0.06]"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card glass-hover rounded-3xl p-5">
            <p className="text-sm text-zinc-500">
              Indexed Items
            </p>

            <h2 className="mt-3 text-4xl font-black text-primary">
              {items.length}
            </h2>
          </div>

          <div className="glass-card glass-hover rounded-3xl p-5">
            <p className="text-sm text-zinc-500">
              Search Results
            </p>

            <h2 className="mt-3 text-4xl font-black text-blue-400">
              {
                suggestions.length
              }
            </h2>
          </div>
        </div>

        {/* Items */}
        <div className="glass-card rounded-[2rem] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Item Intelligence
              </h2>

              <p className="text-sm text-zinc-500">
                {
                  suggestions.length
                } visible
              </p>
            </div>
          </div>

          <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-2">
            {suggestions.map(
              (item) => (
                <Link
                  key={item.id}
                  href={`/items/${createItemSlug(
                    item.name
                  )}`}
                >
                  <div className="glass-card glass-hover rounded-[2rem] p-5 transition-all duration-300">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        {/* Icon */}
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                          {item.icon ? (
                            <img
                              src={
                                item.icon
                              }
                              alt={
                                item.name
                              }
                              className="h-12 w-12 object-contain"
                            />
                          ) : (
                            <div className="text-2xl text-zinc-600">
                              ⬢
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-bold text-white">
                            {item.name}
                          </h2>

                          <p className="mt-1 text-sm text-zinc-500">
                            {
                              item.category
                            }
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
  {/* Quest / Handover */}
  {item.handoverTasks
    ?.length > 0 && (
    <div className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
      QUEST ITEM
    </div>
  )}

  {/* Combat */}
  {item.combatTasks
    ?.length > 0 && (
    <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400">
      COMBAT
    </div>
  )}

  {/* Keys */}
  {item.keyTasks
    ?.length > 0 && (
    <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
      KEY ITEM
    </div>
  )}

  {/* Hideout */}
  {item.hideoutTasks
    ?.length > 0 && (
    <div className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-medium text-orange-400">
      HIDEOUT
    </div>
  )}

  {/* Crafting */}
  {item.craftTasks
    ?.length > 0 && (
    <div className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-400">
      CRAFT
    </div>
  )}

  {/* Flea */}
  {item.fleaBanned && (
    <div className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-400">
      FLEA BANNED
    </div>
  )}
</div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          Avg Price
                        </p>

                        <h3 className="mt-2 text-xl font-black text-primary">
                          ₽
                          {item.avgPrice?.toLocaleString()}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}