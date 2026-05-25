import { CompactTaskCard } from "./CompactTaskCard";

import { TarkovTask } from "@/types/task";

interface TaskListPanelProps {
  tasks: TarkovTask[];

  selectedTaskId?: string;

  completedTasks: string[];

  onSelectTask: (
    task: TarkovTask
  ) => void;
}

export function TaskListPanel({
  tasks,
  selectedTaskId,
  completedTasks,
  onSelectTask,
}: TaskListPanelProps) {
  return (
    <div className="glass-card h-[75vh] rounded-[2rem] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">
            Tasks
          </h2>

          <p className="text-sm text-zinc-500">
            {tasks.length} visible
          </p>
        </div>
      </div>

      <div className="flex h-[calc(75vh-80px)] flex-col gap-3 overflow-y-auto pr-2">
        {tasks.map(
          (task: TarkovTask) => (
            <CompactTaskCard
              key={task.id}
              task={task}
              selected={
                selectedTaskId ===
                task.id
              }
              completed={completedTasks.includes(
                task.id
              )}
              locked={
                !!task
                  .missingRequirements
                  ?.length
              }
              onClick={() =>
                onSelectTask(
                  task
                )
              }
            />
          )
        )}
      </div>
    </div>
  );
}