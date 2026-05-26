import Link from "next/link";

import {
  TarkovObjective,
  TarkovTask,
} from "@/types/task";

interface TaskCardProps {
  task: TarkovTask;

  completed: boolean;

  locked: boolean;

  onToggleComplete: () => void;
}

export function TaskCard({
  task,
  completed,
  locked,
  onToggleComplete,
}: TaskCardProps) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block"
    >
      <div className="glass-card glass-hover rounded-[2rem] p-5 transition-all duration-300">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-white">
                {task.name}
              </h2>

              {task.kappaRequired && (
                <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-400">
                  KAPPA
                </div>
              )}

              <div
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  completed
                    ? "bg-green-500/15 text-green-400"
                    : locked
                    ? "bg-red-500/15 text-red-400"
                    : "bg-blue-500/15 text-blue-400"
                }`}
              >
                {completed
                  ? "COMPLETED"
                  : locked
                  ? "LOCKED"
                  : "ACTIVE"}
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-500">
              {task.trader}
            </p>
          </div>
        </div>

        {/* Objectives */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-zinc-400">
            Objectives
          </p>

          <div className="flex flex-col gap-3">
            {task.objectives.map(
              (
                objective: TarkovObjective,
                index: number
              ) => (
                <div
                  key={`${task.id}-objective-${index}`}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
                >
                  •{" "}
                  {
                    objective.description
                  }
                </div>
              )
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap gap-2">
          {task.levelRequired > 0 && (
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
              LV{" "}
              {
                task.levelRequired
              }
            </div>
          )}

          {task.maps.map(
            (map: string) => (
              <div
                key={map}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400"
              >
                {map}
              </div>
            )
          )}

          {task.xp > 0 && (
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {task.xp.toLocaleString()}{" "}
              XP
            </div>
          )}
        </div>

        {/* Action */}
        <div className="mt-6">
          <button
            onClick={(
              event
            ) => {
              event.preventDefault();

              event.stopPropagation();

              onToggleComplete();
            }}
            className={`w-full rounded-2xl py-4 font-semibold transition-all duration-300 ${
              completed
                ? "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                : "bg-gradient-to-r from-[#B8895A] to-[#D4A574] text-black hover:scale-[1.01]"
            }`}
          >
            {completed
              ? "Mark Incomplete"
              : "Mark Complete"}
          </button>
        </div>
      </div>
    </Link>
  );
}