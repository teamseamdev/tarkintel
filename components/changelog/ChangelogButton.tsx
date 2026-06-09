"use client";

import {
  useState,
} from "react";

const changelog = [
  {
    version: "0.1.0",
    date: "6/9/26",
    changes: [
      "Massive performance improvements across Tasks, Items, and Hideout",
      "New hideout progression planner",
      "Discord cloud profile syncing",
      "Mobile app-style navigation improvements",
      "Feedback system added",
      "Advanced progression analytics",
      "Shopping list and upgrade intelligence",
    ],
  },
];

export function ChangelogButton() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() =>
          setOpen(true)
        }
        className="fixed bottom-[240px] right-4 z-40 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-400 shadow-2xl transition hover:scale-[1.03] active:scale-[0.98]"
      >
        Updates
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl rounded-[2rem] p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary">
                  TarkIntel
                </p>

                <h2 className="mt-2 text-4xl font-black">
                  Changelog
                </h2>

                <p className="mt-3 text-sm text-zinc-400">
                  Public beta updates,
                  improvements, and
                  release notes.
                </p>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]"
              >
                Close
              </button>
            </div>

            <div className="mt-8 flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-2">
              {changelog.map(
                (entry) => (
                  <div
                    key={
                      entry.version
                    }
                    className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black">
                          v
                          {
                            entry.version
                          }
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          {
                            entry.date
                          }
                        </p>
                      </div>

                      <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
                        LIVE
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      {entry.changes.map(
                        (
                          change
                        ) => (
                          <div
                            key={
                              change
                            }
                            className="flex items-start gap-3"
                          >
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />

                            <p className="text-sm text-zinc-300">
                              {
                                change
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}