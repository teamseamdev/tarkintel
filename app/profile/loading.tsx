export default function Loading() {
  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Hero */}
        <div className="glass-card rounded-[2rem] p-6">
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 rounded-full bg-white/10" />

            <div className="flex-1">
              <div className="h-4 w-40 rounded bg-white/10" />

              <div className="mt-4 h-10 w-56 rounded bg-white/10" />

              <div className="mt-4 h-4 w-full max-w-sm rounded bg-white/10" />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {Array.from({
              length: 3,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="h-4 w-16 rounded bg-white/10" />

                <div className="mt-4 h-10 w-20 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="glass-card rounded-[2rem] p-5">
          <div className="h-8 w-56 rounded bg-white/10" />

          <div className="mt-6 h-4 w-full rounded-full bg-white/10" />
        </div>

        {/* Trader Cards */}
        <div className="glass-card rounded-[2rem] p-5">
          <div className="h-8 w-48 rounded bg-white/10" />

          <div className="mt-6 flex flex-col gap-4">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
              >
                <div className="h-6 w-40 rounded bg-white/10" />

                <div className="mt-4 h-3 w-full rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}