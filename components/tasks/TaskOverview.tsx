interface TaskOverviewProps {
  completedCount: number;

  visibleCount: number;
}

export function TaskOverview({
  completedCount,
  visibleCount,
}: TaskOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="glass-card glass-hover rounded-3xl p-5">
        <p className="text-sm text-zinc-500">
          Completed
        </p>

        <h2 className="mt-3 text-4xl font-black text-primary">
          {completedCount}
        </h2>
      </div>

      <div className="glass-card glass-hover rounded-3xl p-5">
        <p className="text-sm text-zinc-500">
          Visible Tasks
        </p>

        <h2 className="mt-3 text-4xl font-black text-blue-400">
          {visibleCount}
        </h2>
      </div>
    </div>
  );
}