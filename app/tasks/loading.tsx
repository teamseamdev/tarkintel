export default function Loading() {
  return (
    <div className="min-h-screen p-4 pb-8 text-white">
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Header */}
        <div className="glass-card rounded-[2rem] p-6">
          <div className="h-4 w-40 rounded bg-white/10" />

          <div className="mt-4 h-12 w-64 rounded bg-white/10" />

          <div className="mt-4 h-4 w-full max-w-md rounded bg-white/10" />
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="glass-card rounded-[2rem] p-5"
            >
              <div className="h-4 w-20 rounded bg-white/10" />

              <div className="mt-4 h-10 w-16 rounded bg-white/10" />
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="glass-card rounded-[2rem] p-4">
          <div className="h-14 w-full rounded-2xl bg-white/10" />
        </div>

        {/* Filters */}
        <div className="glass-card rounded-[2rem] p-4">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-24 rounded-full bg-white/10"
              />
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="glass-card rounded-[2rem] p-4">
          <div className="flex flex-col gap-4">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-5"
              >
                <div className="h-6 w-48 rounded bg-white/10" />

                <div className="mt-3 h-4 w-full rounded bg-white/10" />

                <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />

                <div className="mt-5 flex gap-2">
                  <div className="h-8 w-20 rounded-full bg-white/10" />

                  <div className="h-8 w-24 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}