import { TarkovTask } from "@/types/task";

interface CompactTaskCardProps {
  task: TarkovTask;

  selected: boolean;

  completed: boolean;

  locked: boolean;

  onClick: () => void;
}

export function CompactTaskCard({
  task,
  selected,
  completed,
  locked,
  onClick,
}: CompactTaskCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
        selected
          ? "border-primary/40 bg-primary/10"
          : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-bold text-white">
            {task.name}
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            {task.trader}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {task.kappaRequired && (
            <div className="rounded-full bg-yellow-500/15 px-2 py-1 text-[10px] font-semibold text-yellow-400">
              KAPPA
            </div>
          )}

          <div
            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
              completed
                ? "bg-green-500/15 text-green-400"
                : locked
                ? "bg-red-500/15 text-red-400"
                : "bg-blue-500/15 text-blue-400"
            }`}
          >
            {completed
              ? "DONE"
              : locked
              ? "LOCKED"
              : "ACTIVE"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {task.levelRequired && (
          <div className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-zinc-400">
            LV {task.levelRequired}
          </div>
        )}

        {task.xp && (
          <div className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
            {task.xp.toLocaleString()} XP
          </div>
        )}
      </div>
    </button>
  );
}