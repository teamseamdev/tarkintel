import { getLiveTasks } from "@/lib/live-tasks";

export default async function LiveTasksPage() {
  const tasks =
    await getLiveTasks();

  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="glass-card rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Live Tarkov.dev API
          </p>

          <h1 className="text-gradient mt-3 text-5xl font-black">
            Live Tasks
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Real-time Tarkov task
            progression data.
          </p>
        </div>

        {/* Tasks */}
        <div className="flex flex-col gap-4">
          {tasks
            .slice(0, 30)
            .map((task: any) => (
              <div
                key={task.id}
                className="glass-card glass-hover rounded-[2rem] p-5"
              >
                {/* Top */}
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
                      {
                        task.trader
                          ?.name
                      }
                    </p>
                  </div>

                  <div className="rounded-full bg-primary/15 px-4 py-2 text-xs font-semibold text-primary">
                    {task.experience?.toLocaleString()}{" "}
                    XP
                  </div>
                </div>

                {/* Objectives */}
                <div className="mt-5">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Objectives
                  </p>

                  <div className="flex flex-col gap-2">
                    {task.objectives
                      ?.slice(0, 3)
                      .map(
                        (
                          objective: any
                        ) => (
                          <div
                            key={
                              objective.id
                            }
                            className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
                          >
                            {
                              objective.description
                            }
                          </div>
                        )
                      )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {task.map && (
                    <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                      {
                        task.map
                          ?.name
                      }
                    </div>
                  )}

                  {task.taskRequirements
                    ?.length > 0 && (
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      PREREQUISITES
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}