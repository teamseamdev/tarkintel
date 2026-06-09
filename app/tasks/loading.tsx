export default function Loading() {
  return (
    <div className="min-h-screen p-4 text-white">
      <div className="flex flex-col gap-4">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-3xl border border-white/5 bg-white/[0.03]"
          />
        ))}
      </div>
    </div>
  );
}