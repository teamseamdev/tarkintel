"use client";

import {
  useState,
} from "react";

const changelog = [
 {
  version: "0.1.5",
  date: "7/3/26",
  changes: [
    "Added Catch-Up Setup for mid-wipe players to quickly mark prerequisite task chains complete",
    "Added bulk task completion support for faster progression setup",
    "Added profile entry point for Catch-Up Setup",
    "Improved onboarding flow for players who are new to TarkIntel but already progressed in-game",
    "Additional mobile-first UI refinements across the application",
    "General beta polish, navigation improvements, and quality-of-life updates",
  ],
},
{
  version: "0.1.4",
  date: "6/12/26",
  changes: [
   "Fixed auth issue causing profile page to not sync across mobile & web",
   "Added persisitant status to menu bar on top for mobile",
   "Additional mobile-first UI refinements across the application",
   "General beta polish, navigation improvements, and quality-of-life updates",
  
  ],
},

  {
  version: "0.1.3",
  date: "6/10/26",
  changes: [
    "Completely redesigned mobile navigation with a new top-mounted hamburger menu",
    "Removed the persistent bottom navigation bar to maximize usable screen space",
    "Moved Feedback and Updates into the mobile navigation experience",
    "Desktop now retains floating Feedback and Updates buttons while mobile uses menu shortcuts",
    "Improved Hideout usability with cleaner module management and completion filtering",
    "Additional mobile-first UI refinements across the application",
    "General beta polish, navigation improvements, and quality-of-life updates",
  ],
},
  
  {
    version: "0.1.2",
    date: "6/10/26",
    changes: [
      "Introduced TarkIntel Next Best Action recommendation system",
      "Homepage now surfaces recommended hideout upgrades dynamically",
      "Improved Tarkov.dev timeout handling and API recovery systems",
      "Prevented production crashes from malformed external API responses",
      "Improved loading resilience across Tasks, Items, and Hideout",
      "Completed Hideout modules can now be hidden for cleaner navigation",
      "Additional UI polish and beta quality-of-life improvements",
    ],
  },

  {
    version: "0.1.1",
    date: "6/10/26",
    changes: [
      "Major backend stability and production hardening improvements",
      "Improved external API resilience and timeout handling",
      "Better live data error recovery across Tasks, Items, and Hideout",
      "Reduced mobile layout shifting and improved loading stability",
      "Hideout modules now collapse by default for cleaner navigation",
      "General UI polish and beta stability improvements",
    ],
  },

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

interface ChangelogModalProps {
  open: boolean;

  onClose: () => void;
}

export function ChangelogModal({
  open,
  onClose,
}: ChangelogModalProps) {
  if (!open) {
    return null;
  }

  return (
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
            onClick={
              onClose
            }
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]"
          >
            Close
          </button>
        </div>

        <div className="mt-8 flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-2">
          {changelog.map(
            (
              entry
            ) => (
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
  );
}

export function ChangelogButton() {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <>
      <button
        onClick={() =>
          setOpen(
            true
          )
        }
        className="fixed bottom-[240px] right-4 z-40 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-400 shadow-2xl transition hover:scale-[1.03] active:scale-[0.98]"
      >
        Updates
      </button>

      <ChangelogModal
        open={
          open
        }
        onClose={() =>
          setOpen(
            false
          )
        }
      />
    </>
  );
}