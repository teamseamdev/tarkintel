export default function Loading() {
  return (
    <div className="min-h-screen p-4 text-white">
      <div className="flex flex-col gap-6">
        <div className="h-64 animate-pulse rounded-[2rem] border border-white/5 bg-white/[0.03]" />

        <div className="h-72 animate-pulse rounded-[2rem] border border-white/5 bg-white/[0.03]" />

        <div className="h-96 animate-pulse rounded-[2rem] border border-white/5 bg-white/[0.03]" />
      </div>
    </div>
  );
}