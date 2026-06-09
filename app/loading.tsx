export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#05070A] text-white">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/icons/icon-512.png"
          alt="TarkIntel"
          className="h-32 w-32 animate-pulse object-contain"
        />

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-black tracking-wide text-white">
            TARKINTEL
          </h1>

          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Tactical Intelligence
          </p>
        </div>

        <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}