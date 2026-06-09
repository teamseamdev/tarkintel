"use client";

import {
  useEffect,
  useState,
} from "react";

export function BetaBanner() {
  const [visible, setVisible] =
    useState(false);

  /*
    SHOW ONCE
  */

  useEffect(() => {
    const dismissed =
      localStorage.getItem(
        "beta-banner-dismissed"
      );

    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  /*
    DISMISS
  */

  function dismiss() {
    localStorage.setItem(
      "beta-banner-dismissed",
      "true"
    );

    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="glass-card mb-6 overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/5">
      <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/15 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-primary">
              PUBLIC BETA
            </div>

            <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-emerald-400">
              LIVE DEVELOPMENT
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-black text-white">
            Welcome to TarkIntel
          </h2>

          <p className="mt-3 max-w-2xl text-sm text-zinc-400">
            TarkIntel is currently in
            active public beta.
            Features, progression
            systems, and performance
            improvements are being
            updated frequently.
          </p>

          <p className="mt-3 text-sm text-zinc-500">
            Please use the Feedback
            button to report bugs,
            suggest features, or help
            improve the platform.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={dismiss}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}