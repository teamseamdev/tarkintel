import Link from "next/link";

import { getNormalizedLiveTasks } from "@/lib/live-task-source";

export default async function LiveTasksV2Page() {
  const tasks =
    await getNormalizedLiveTasks();

  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="glass-card rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            TarkIntel Live Engine
          </p>

          <h1 className="text-gradient mt-3 text-5xl font-black">
            Live Tasks V2
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Fully normalized live
            Tarkov task data.
          </p>
        </div>

        {/* Tasks */}
        <div className="flex flex-col gap-4">
          {tasks
            .slice(0, 50)
            .map((task: any) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
              >
                <div className="glass-card glass-hover rounded-[2rem] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black">
                          {task.name}
                        </h2>

                        {task.kappaRequired && (
                          <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-400">
                            KAPPA
                          </div>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-zinc-500">
                        {task.trader}
                      </p>
                    </div>

                    <div className="rounded-full bg-primary/15 px-4 py-2 text-xs font-semibold text-primary">
                      {task.xp.toLocaleString()}{" "}
                      XP
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    {task.objectives
                      .slice(0, 3)
                      .map(
                        (
                          objective: string
                        ) => (
                          <div
                            key={
                              objective
                            }
                            className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
                          >
                            {
                              objective
                            }
                          </div>
                        )
                      )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {task.maps?.map(
                      (
                        map: string
                      ) => (
                        <div
                          key={map}
                          className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400"
                        >
                          {map}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}