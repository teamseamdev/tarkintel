import type {
  ActionableUpgrade,
} from "@/lib/progression-engine";

interface RecommendedUpgradeCardProps {
  upgrade:
    | ActionableUpgrade
    | null;
}

export function RecommendedUpgradeCard({
  upgrade,
}: RecommendedUpgradeCardProps) {
  /*
    FULLY COMPLETE
  */

  if (!upgrade) {
    return (
      <div className="glass-card rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <div className="text-6xl opacity-50">
          🏆
        </div>

        <h2 className="mt-6 text-3xl font-black text-white">
          Hideout Complete
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
          You currently have no
          remaining actionable
          hideout upgrades.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2rem] border border-primary/20 bg-primary/5 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Recommended Next Upgrade
          </p>

          <h2 className="mt-3 text-3xl font-black">
            {
              upgrade.module.name
            }{" "}
            Level{" "}
            {
              upgrade.level.level
            }
          </h2>

          <p className="mt-3 max-w-lg text-sm text-zinc-400">
            This is currently the
            next actionable hideout
            upgrade based on your
            progression state.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">
            PRIORITY
          </div>

          <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
            ACTIONABLE
          </div>
        </div>
      </div>
    </div>
  );
}