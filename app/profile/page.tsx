export default function ProfilePage() {
  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-zinc-500">
            PMC Profile
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Profile
          </h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">
            Future Features
          </h2>

          <div className="mt-4 flex flex-col gap-2 text-zinc-400">
            <p>
              • Discord Login
            </p>

            <p>
              • Cloud Save Sync
            </p>

            <p>
              • PMC Progression
            </p>

            <p>
              • Squad Features
            </p>

            <p>
              • Wipe Tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}