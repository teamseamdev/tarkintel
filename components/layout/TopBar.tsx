interface TopBarProps {
  title: string;

  subtitle?: string;
}

export function TopBar({
  title,
  subtitle,
}: TopBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-black tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-sm text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
          Tarkov.dev Connected
        </div>
      </div>
    </div>
  );
}