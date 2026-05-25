import { TarkovTask } from "@/types/task";

interface TaskDetailPanelProps {
  task?: TarkovTask;

  completed: boolean;

  onToggle: (
    taskId: string
  ) => void;
}

export function TaskDetailPanel({
  task,
  completed,
  onToggle,
}: TaskDetailPanelProps) {
  if (!task) {
    return (
      <div className="glass-card flex h-[75vh] items-center justify-center rounded-[2rem] p-8">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">
            Select a Task
          </h2>

          <p className="mt-3 text-zinc-500">
            Choose a task from the
            list to view details.
          </p>
        </div>
      </div>
    );
  }

  const locked =
    !!task
      .missingRequirements
      ?.length;

  return (
    <div className="glass-card h-[75vh] overflow-y-auto rounded-[2rem] p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-black">
              {task.name}
            </h1>

            {task.kappaRequired && (
              <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-400">
                KAPPA
              </div>
            )}
          </div>

          <p className="mt-3 text-zinc-500">
            {task.trader}
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-semibold ${
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

      {/* Objectives */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">
          Objectives
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          {task.objectives?.map(
            (
              objective: any,
              index: number
            ) => (
              <div
                key={`${task.id}-objective-${index}`}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-zinc-300"
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
      <div className="mt-8 flex flex-wrap gap-3">
        {task.levelRequired && (
          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300">
            Level{" "}
            {
              task.levelRequired
            }
          </div>
        )}

        {task.xp && (
          <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {task.xp.toLocaleString()}{" "}
            XP
          </div>
        )}

        {task.maps?.map(
          (map: string) => (
            <div
              key={map}
              className="rounded-full bg-blue-500/15 px-4 py-2 text-sm text-blue-400"
            >
              {map}
            </div>
          )
        )}
      </div>

      {/* Actions */}
      <div className="mt-10">
        <button
          onClick={() =>
            onToggle(task.id)
          }
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
  );
}