import Link from "next/link";

import {
  createItemSlug,
} from "@/lib/item-slug";

import {
  getRequirementAllocation,
} from "@/lib/progression-engine";

import type {
  HideoutRequirement,
} from "@/types/hideout";

import type {
  TarkovItem,
} from "@/types/item";

interface HideoutRequirementRowProps {
  requirement: HideoutRequirement;

  item?: TarkovItem;

  completed: boolean;

  isActionable: boolean;

  getTrackedQuantity: (
    itemId: string
  ) => number;
}

export function HideoutRequirementRow({
  requirement,
  item,
  completed,
  isActionable,
  getTrackedQuantity,
}: HideoutRequirementRowProps) {
  const allocation =
    getRequirementAllocation({
      requirement,

      item,

      completed,

      isActionable,

      getTrackedQuantity,
    });

  return (
    <Link
      href={`/items/${createItemSlug(requirement.itemName)}`}
      className="block"
    >
      <div className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3 transition hover:border-primary/30 hover:bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
            {item?.icon ? (
              <img
                src={
                  item.icon
                }
                alt={
                  item.name
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
            <h4 className="text-sm font-semibold text-white">
              {
                requirement.itemName
              }
            </h4>

            <p className="text-xs text-zinc-500">
              Hideout Material
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            x
            {
              requirement.count
            }
          </div>

          <div className="text-[10px] text-zinc-500">
            {
              allocation.owned
            }{" "}
            owned
          </div>

          {allocation.used >
            0 && (
            <div className="text-[10px] text-green-400">
              {
                allocation.used
              }{" "}
              used
            </div>
          )}

          {allocation.reserved >
            0 && (
            <div className="text-[10px] text-yellow-400">
              {
                allocation.reserved
              }{" "}
              reserved
            </div>
          )}

          <div className="text-[10px] text-zinc-400">
            {
              allocation.free
            }{" "}
            free
          </div>
        </div>
      </div>
    </Link>
  );
}