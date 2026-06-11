import { getLiveItems } from "@/lib/live-item-source";

interface LiveItem {
  id: string;

  name: string;

  iconLink?: string;

  avg24hPrice?: number;

  categories?: {
    name?: string;
  }[];
}

export default async function LiveItemsPage() {
  const items: LiveItem[] =
    await getLiveItems();

  return (
    <div className="min-h-screen p-4 pb-8 text-white">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="glass-card rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Live Tarkov.dev API
          </p>

          <h1 className="text-gradient mt-3 text-5xl font-black">
            Live Items
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Real-time Tarkov item
            data powered by
            Tarkov.dev
          </p>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-4">
          {items
            .slice(0, 50)
            .map((item) => (
              <div
                key={item.id}
                className="glass-card glass-hover rounded-[2rem] p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.iconLink
                    }
                    alt={item.name}
                    className="h-16 w-16 object-contain"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-bold">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      {
                        item
                          .categories?.[0]
                          ?.name
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Avg Price
                    </p>

                    <h3 className="mt-2 text-xl font-black text-primary">
                      {item.avg24hPrice?.toLocaleString()}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      ₽
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}