"use client";

import Link from "next/link";

import {
  createItemSlug,
} from "@/lib/item-slug";

import {
  useFavoriteItems,
} from "@/hooks/useFavoriteItems";

interface ShoppingListItem {
  itemId: string;

  itemName: string;

  count: number;

  icon?: string;
}

interface ShoppingListCardProps {
  items: ShoppingListItem[];
}

export function ShoppingListCard({
  items,
}: ShoppingListCardProps) {
  const {
    favorites,
    toggleFavorite,
    isFavorite,
  } =
    useFavoriteItems();

  /*
    NOTHING NEEDED
  */

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-[2rem] border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Progression Shopping List
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Remaining Items
          </h2>
        </div>

        <div className="rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">
          {items.length} items
        </div>
      </div>

      <div className="mt-5 flex max-h-[500px] flex-col gap-3 overflow-y-auto pr-2">
        {[...items]
          .sort((a, b) => {
            const aFav =
              isFavorite(
                a.itemId
              );

            const bFav =
              isFavorite(
                b.itemId
              );

            /*
              FAVORITES
              FIRST
            */

            if (
              aFav &&
              !bFav
            ) {
              return -1;
            }

            if (
              !aFav &&
              bFav
            ) {
              return 1;
            }

            /*
              THEN
              SORT BY
              DEMAND
            */

            return (
              b.count -
              a.count
            );
          })
          .map((item) => (
            <Link
              key={item.itemId}
              href={`/items/${createItemSlug(item.itemName)}`}
              className="block"
            >
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 p-4 transition hover:border-primary/30 hover:bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                    {item.icon ? (
                      <img
                        src={
                          item.icon
                        }
                        alt={
                          item.itemName
                        }
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <div className="text-zinc-600">
                        ⬢
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {
                        item.itemName
                      }
                    </h3>

                    <p className="text-xs text-zinc-500">
                      Still needed for
                      progression
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(
                      event
                    ) => {
                      event.preventDefault();

                      toggleFavorite(
                        item.itemId
                      );
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition ${
                      isFavorite(
                        item.itemId
                      )
                        ? "border-yellow-500/30 bg-yellow-500/15 text-yellow-400"
                        : "border-white/10 bg-white/[0.03] text-zinc-500 hover:text-white"
                    }`}
                  >
                    ★
                  </button>

                  <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                    {item.count}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}