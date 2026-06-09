export default function Loading() {
  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Header */}
        <div className="glass-card rounded-[2rem] p-6">
          <div className="h-4 w-48 rounded bg-white/10" />

          <div className="mt-4 h-12 w-56 rounded bg-white/10" />

          <div className="mt-4 h-4 w-full max-w-md rounded bg-white/10" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({
            length: 2,
          }).map((_, index) => (
            <div
              key={index}
              className="glass-card rounded-3xl p-5"
            >
              <div className="h-4 w-24 rounded bg-white/10" />

              <div className="mt-4 h-10 w-20 rounded bg-white/10" />
            </div>
          ))}
        </div>

        {/* Planner */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="glass-card rounded-[2rem] p-5"
            >
              <div className="h-8 w-40 rounded bg-white/10" />

              <div className="mt-6 flex flex-col gap-4">
                {Array.from({
                  length: 3,
                }).map(
                  (
                    __,
                    levelIndex
                  ) => (
                    <div
                      key={
                        levelIndex
                      }
                      className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                    >
                      <div className="h-5 w-28 rounded bg-white/10" />

                      <div className="mt-4 h-4 w-full rounded bg-white/10" />

                      <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}