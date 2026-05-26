"use client";

import { hideoutModules } from "@/data/hideout/modules";

import { getItemById } from "@/lib/item-intelligence";

import { PageContainer } from "@/components/layout/PageContainer";

export default function HideoutPage() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] glass-card p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />

        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Tactical Infrastructure
          </p>

          <h1 className="text-gradient mt-3 text-5xl font-black tracking-tight">
            Hideout
          </h1>

          <p className="mt-3 max-w-sm text-sm text-zinc-400">
            Upgrade planning,
            progression tracking,
            and future requirement
            forecasting.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card glass-hover rounded-3xl p-5">
          <p className="text-sm text-zinc-500">
            Modules
          </p>

          <h2 className="mt-3 text-4xl font-black text-primary">
            {
              hideoutModules.length
            }
          </h2>
        </div>

        <div className="glass-card glass-hover rounded-3xl p-5">
          <p className="text-sm text-zinc-500">
            Upgrades
          </p>

          <h2 className="mt-3 text-4xl font-black text-blue-400">
            {hideoutModules.reduce(
              (
                total,
                module
              ) =>
                total +
                module.requiredItems
                  .length,
              0
            )}
          </h2>
        </div>
      </div>

      {/* Modules */}
      {hideoutModules.map(
        (module) => (
          <div
            key={module.id}
            className="glass-card glass-hover relative overflow-hidden rounded-[2rem] p-5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#B8895A]/5 to-transparent" />

            <div className="relative z-10">
              {/* Top */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black">
                      {module.name}
                    </h2>

                    <div className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-bold text-primary">
                      MODULE
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-zinc-500">
                    Required Level{" "}
                    {
                      module.requiredLevel
                    }
                  </p>
                </div>

                <div className="rounded-full bg-blue-500/15 px-4 py-2 text-xs font-semibold text-blue-400">
                  LV{" "}
                  {module.level}
                </div>
              </div>

              {/* Required Items */}
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Required Items
                  </h3>

                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
                    {
                      module
                        .requiredItems
                        .length
                    }{" "}
                    Items
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {module.requiredItems.map(
                    (itemRef) => {
                      const item =
                        getItemById(
                          itemRef.itemId
                        );

                      return (
                        <div
                          key={`${module.id}-${itemRef.itemId}`}
                          className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                              {item?.icon ? (
                                <img
                                  src={
                                    item.icon
                                  }
                                  alt={
                                    item.name
                                  }
                                  className="h-10 w-10 object-contain"
                                />
                              ) : (
                                <div className="text-xl text-zinc-600">
                                  ⬢
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div>
                              <h4 className="font-semibold">
                                {item
                                  ?.name ||
                                  itemRef.itemId}
                              </h4>

                              <p className="mt-1 text-sm text-zinc-500">
                                Hideout Upgrade
                                Material
                              </p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="rounded-full bg-primary/15 px-4 py-2 text-xs font-semibold text-primary">
                            x
                            {
                              itemRef.amount
                            }
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </PageContainer>
  );
}