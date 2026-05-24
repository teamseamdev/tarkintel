"use client";

import Link from "next/link";

import { useState } from "react";

import {
  searchItems,
  getTasksByItem,
  getItemPriority,
  createItemSlug,
} from "@/lib/item-intelligence";

import { Item } from "@/types/item";

export default function ItemsPage() {
  const [search, setSearch] =
    useState("");

  const [selectedItem, setSelectedItem] =
    useState<Item | null>(null);

  const suggestions = search
    ? searchItems(search)
    : [];

  const matchingTasks = selectedItem
    ? getTasksByItem(selectedItem.id)
    : [];

  const priority = selectedItem
    ? getItemPriority(selectedItem.id)
    : null;

  return (
    <div className="min-h-screen bg-background p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-sm text-zinc-500">
            Smart Stash Assistant
          </p>

          <h1 className="text-3xl font-bold">
            Item Lookup
          </h1>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              setSelectedItem(null);
            }}
            className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-white outline-none transition focus:border-green-400"
          />

          {/* Suggestions */}
          {search.length > 0 &&
            !selectedItem && (
              <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-card shadow-2xl">
                <div className="flex max-h-72 flex-col overflow-y-auto">
                  {suggestions.length >
                  0 ? (
                    suggestions.map(
                      (item) => (
                        <Link
                          href={`/items/${createItemSlug(
                            item.id
                          )}`}
                          key={item.id}
                        >
                          <button
                            onClick={() => {
                              setSelectedItem(
                                item
                              );

                              setSearch(
                                item.name
                              );
                            }}
                            className="w-full border-b border-zinc-800 px-4 py-4 text-left transition hover:bg-zinc-900"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {item.name}
                                </p>

                                <p className="text-sm text-zinc-500">
                                  {
                                    item.category
                                  }
                                </p>
                              </div>

                              <div className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">
                                ₽
                                {item.avgPrice?.toLocaleString()}
                              </div>
                            </div>
                          </button>
                        </Link>
                      )
                    )
                  ) : (
                    <div className="px-4 py-4 text-zinc-500">
                      No items found.
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Results */}
        {selectedItem && (
          <div className="flex flex-col gap-4">
            {/* Intelligence */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-green-400">
                    KEEP THIS ITEM
                  </h2>

                  <p className="text-sm text-zinc-400">
                    Needed for future
                    progression
                  </p>
                </div>

                <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                  {priority}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-zinc-500">
                    Related Tasks
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {
                      matchingTasks.length
                    }
                  </h3>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-zinc-500">
                    Flea Status
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {selectedItem.fleaBanned
                      ? "BANNED"
                      : "ALLOWED"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Matching Tasks */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Required For
                </h2>

                <span className="text-sm text-zinc-500">
                  Future Tasks
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {matchingTasks.length >
                0 ? (
                  matchingTasks.map(
                    (task) => (
                      <div
                        key={task.id}
                        className="rounded-xl bg-zinc-900/50 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">
                              {task.name}
                            </h3>

                            <p className="text-sm text-zinc-500">
                              {
                                task.trader
                              }
                            </p>
                          </div>

                          {task.kappaRequired && (
                            <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
                              KAPPA
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-xl bg-zinc-900/50 p-4 text-sm text-zinc-500">
                    No tasks currently use
                    this item.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}