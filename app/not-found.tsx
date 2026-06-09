import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-white">
      <div className="glass-card w-full max-w-xl rounded-[2rem] p-8 text-center">
        <div className="text-7xl font-black text-primary">
          404
        </div>

        <h1 className="mt-4 text-4xl font-black">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
          The page you are looking
          for does not exist or may
          have been moved.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}