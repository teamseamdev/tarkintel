import { hideoutModules } from "@/data/hideout/modules";

export default function HideoutPage() {
  return (
    <div className="min-h-screen p-4 pb-28 text-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-sm text-zinc-500">
            Hideout Intelligence
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Hideout
          </h1>
        </div>

        {/* Modules */}
        <div className="flex flex-col gap-4">
          {hideoutModules.map((module) => (
            <div
              key={module.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {module.name}
                  </h2>

                  <p className="text-sm text-zinc-500">
                    Required Level:{" "}
                    {module.requiredLevel}
                  </p>
                </div>

                <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400">
                  LV {module.level}
                </div>
              </div>

              {/* Required Items */}
              <div className="mt-4 flex flex-col gap-3">
                {module.requiredItems.map(
                  (item) => (
                    <div
                      key={item.item}
                      className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3"
                    >
                      <div>
                        <h3 className="font-medium">
                          {item.item}
                        </h3>

                        <p className="text-sm text-zinc-500">
                          Hideout Upgrade
                        </p>
                      </div>

                      <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                        x{item.amount}
                      </div>
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