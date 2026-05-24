import Link from "next/link";

import {
  getTaskById,
  getItemById,
} from "@/lib/item-intelligence";

interface TaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskPage({
  params,
}: TaskPageProps) {
  const { id } = await params;

  const task = getTaskById(id);

  if (!task) {
    return (
      <div className="min-h-screen bg-background p-4 text-white">
        <h1 className="text-2xl font-bold">
          Task not found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-sm text-zinc-500">
            {task.trader}
          </p>

          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {task.name}
            </h1>

            {task.kappaRequired && (
              <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
                KAPPA
              </div>
            )}
          </div>
        </div>

        {/* Objectives */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">
            Objectives
          </h2>

          <div className="mt-4 flex flex-col gap-3">
            {task.objectives.map(
              (objective) => (
                <div
                  key={objective}
                  className="rounded-xl bg-zinc-900/50 p-3 text-sm text-zinc-300"
                >
                  {objective}
                </div>
              )
            )}
          </div>
        </div>

        {/* Required Items */}
        {task.requiredItems &&
          task.requiredItems.length >
            0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-lg font-semibold">
                Required Items
              </h2>

              <div className="mt-4 flex flex-col gap-3">
                {task.requiredItems.map(
                  (item) => {
                    const itemData =
                      getItemById(
                        item.itemId
                      );

                    return (
                      <Link
                        href={`/items/${item.itemId}`}
                        key={
                          item.itemId
                        }
                      >
                        <div className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3 transition hover:bg-zinc-900">
                          <div>
                            <h3 className="font-medium">
                              {itemData?.name ||
                                item.itemId}
                            </h3>

                            <p className="text-sm text-zinc-500">
                              Quest Requirement
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.foundInRaid && (
                              <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                                FIR
                              </div>
                            )}

                            <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400">
                              x
                              {
                                item.amount
                              }
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          )}

        {/* Rewards */}
        {task.rewards &&
          task.rewards.length >
            0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-lg font-semibold">
                Rewards
              </h2>

              <div className="mt-4 flex flex-col gap-3">
                {task.rewards.map(
                  (reward) => (
                    <div
                      key={reward}
                      className="rounded-xl bg-zinc-900/50 p-3 text-sm text-zinc-300"
                    >
                      {reward}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* Task Info */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-zinc-500">
              XP
            </p>

            <h2 className="mt-1 text-xl font-bold text-green-400">
              {task.xp?.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-zinc-500">
              Rep
            </p>

            <h2 className="mt-1 text-xl font-bold text-blue-400">
              +
              {task.reputation}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-zinc-500">
              Level
            </p>

            <h2 className="mt-1 text-xl font-bold text-yellow-400">
              {
                task.levelRequired
              }
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}