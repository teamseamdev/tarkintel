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
  if (!upgrade) {
    return null;
  }

  return (
    <div className="glass-card rounded-[2rem] border border-primary/20 bg-primary/5 p-6">
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
  );
}