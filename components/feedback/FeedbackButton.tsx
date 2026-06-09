"use client";

import {
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import { useAuth } from "@/components/auth-provider";

export function FeedbackButton() {
  const { profile } =
    useAuth();

  const [open, setOpen] =
    useState(false);

  const [category, setCategory] =
    useState("Bug");

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  async function submitFeedback() {
    try {
      if (!message.trim()) {
        return;
      }

      setSubmitting(true);

      const payload = {
        profile_id:
          profile?.id || null,

        email:
          null,

        category,

        message,

        user_agent:
          navigator.userAgent,

        page:
          window.location.pathname,
      };

      const { error } =
        await supabase
          .from(
            "feedback_reports"
          )
          .insert(payload);

      if (error) {
        throw error;
      }

      setSubmitted(true);

      setMessage("");

      setTimeout(() => {
        setOpen(false);

        setSubmitted(false);
      }, 1500);
    } catch (error) {
      console.error(
        "FEEDBACK ERROR:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() =>
          setOpen(true)
        }
        className="fixed bottom-24 right-4 z-50 rounded-full border border-primary/30 bg-primary px-5 py-3 text-sm font-bold text-black shadow-2xl transition hover:scale-[1.03]"
      >
        Feedback
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg rounded-[2rem] p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black">
                  Beta Feedback
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Found a bug or have
                  an idea? Help improve
                  TarkIntel.
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

            {/* CATEGORY */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-zinc-300">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
              >
                <option>
                  Bug
                </option>

                <option>
                  Feature Request
                </option>

                <option>
                  UI / UX
                </option>

                <option>
                  Progression Issue
                </option>

                <option>
                  Performance
                </option>

                <option>
                  Other
                </option>
              </select>
            </div>

            {/* MESSAGE */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-zinc-300">
                Feedback
              </label>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Describe the issue, suggestion, or feedback..."
                rows={6}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
              />
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={
                  submitFeedback
                }
                disabled={
                  submitting ||
                  !message.trim()
                }
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitted
                  ? "Submitted"
                  : submitting
                  ? "Submitting..."
                  : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}