export default function Loading() {
  return (
    <div className="min-h-screen p-4 pb-8 text-white">
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Header */}
        <div className="glass-card rounded-[2rem] p-6">
          <div className="h-4 w-40 rounded bg-white/10" />

          <div className="mt-4 h-12 w-56 rounded bg-white/10" />

          <div className="mt-4 h-4 w-full max-w-md rounded bg-white/10" />
        </div>

        {/* Search */}
        <div className="glass-card rounded-3xl p-5">
          <div className="h-6 w-40 rounded bg-white/10" />

          <div className="mt-5 h-14 w-full rounded-2xl bg-white/10" />
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

        {/* Items */}
        <div className="glass-card rounded-[2rem] p-4">
          <div className="flex flex-col gap-4">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-5"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="h-16 w-16 rounded-2xl bg-white/10" />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="h-6 w-48 rounded bg-white/10" />

                    <div className="mt-3 h-4 w-24 rounded bg-white/10" />

                    <div className="mt-4 flex gap-2">
                      <div className="h-7 w-20 rounded-full bg-white/10" />

                      <div className="h-7 w-24 rounded-full bg-white/10" />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-24">
                    <div className="h-4 w-16 rounded bg-white/10" />

                    <div className="mt-3 h-8 w-20 rounded bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}