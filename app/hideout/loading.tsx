export default function Loading() {
  return (
    <div className="min-h-screen p-4 text-white">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-96 animate-pulse rounded-[2rem] border border-white/5 bg-white/[0.03]"
          />
        ))}
      </div>
    </div>
  );
}