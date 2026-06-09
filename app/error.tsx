"use client";

import {
  useEffect,
} from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      "GLOBAL ERROR:",
      error
    );
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background text-white">
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="glass-card w-full max-w-xl rounded-[2rem] p-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-5xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-4xl font-black">
              Something Went Wrong
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
              TarkIntel encountered
              an unexpected issue.
              This error has been
              automatically logged.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() =>
                  reset()
                }
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
              >
                Retry
              </button>

              <button
                onClick={() => {
                  window.location.href =
                    "/";
                }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06]"
              >
                Go Home
              </button>
            </div>

            {process.env.NODE_ENV ===
              "development" && (
              <div className="mt-8 overflow-auto rounded-2xl border border-white/5 bg-black/30 p-4 text-left text-xs text-red-400">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}