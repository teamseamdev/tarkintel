"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import { useAuth } from "@/components/auth-provider";

export default function LoginButton() {
  const { user } = useAuth();

  const [showConfirm, setShowConfirm] =
    useState(false);

  async function login() {
    await supabase.auth.signInWithOAuth(
      {
        provider: "discord",
      }
    );
  }

async function logout() {
  await supabase.auth.signOut();

  setShowConfirm(false);

  window.location.reload();
}

  if (user) {
    return (
      <>
        <div className="flex items-center gap-3">
          <img
            src={
              user.user_metadata
                ?.avatar_url
            }
            alt="Avatar"
            className="h-10 w-10 rounded-full border border-zinc-700"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              {
                user.user_metadata
                  ?.full_name
              }
            </span>

            <button
              onClick={() =>
                setShowConfirm(
                  true
                )
              }
              className="text-left text-xs text-red-400 transition hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Logout Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-white">
                Logout?
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Are you sure you want
                to logout of TarkIntel?
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() =>
                    setShowConfirm(
                      false
                    )
                  }
                  className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
                >
                  Cancel
                </button>

                <button
                  onClick={logout}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-400"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={login}
      className="rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400"
    >
      Login with Discord
    </button>
  );
}