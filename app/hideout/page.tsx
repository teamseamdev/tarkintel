import {
  getHideoutModules,
} from "@/lib/hideout-provider";

import { getItems } from "@/lib/item-provider";

import {
  PageContainer,
} from "@/components/layout/PageContainer";

import {
  HideoutPlannerClient,
} from "@/components/hideout/HideoutPlannerClient";

export default async function HideoutPage() {
  /*
    LIVE HIDEOUT
  */

  const hideoutModules =
    await getHideoutModules();

  /*
    LIVE ITEMS
  */

  const items =
    await getItems();

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

          <p className="mt-3 max-w-md text-sm text-zinc-400">
            Live hideout
            progression planning,
            upgrade tracking,
            and future material
            forecasting.
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-zinc-500">
            Modules
          </p>

          <h2 className="mt-3 text-4xl font-black text-primary">
            {
              hideoutModules.length
            }
          </h2>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-zinc-500">
            Upgrade Levels
          </p>

          <h2 className="mt-3 text-4xl font-black text-blue-400">
            {hideoutModules.reduce(
              (
                total,
                module
              ) =>
                total +
                module.levels
                  .length,
              0
            )}
          </h2>
        </div>
      </div>

      {/* Planner */}
      <HideoutPlannerClient
        modules={
          hideoutModules
        }
        items={items}
      />
    </PageContainer>
  );
}