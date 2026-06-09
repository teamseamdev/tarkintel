"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import { useAuth } from "@/components/auth-provider";

export default function LoginButton() {
  const { user } = useAuth();

  const [showConfirm, setShowConfirm] =
    useState(false);

  /*
    LOGIN
  */

  async function login() {
    try {
      /*
        ENVIRONMENT
      */

      const isProduction =
        window.location.hostname !==
        "localhost";

      /*
        REDIRECT TARGET
      */

      const redirectTo =
        isProduction
          ? "https://tarkintel.com"
          : "http://localhost:3000";

      /*
        DETECT IOS / PWA
      */

      const isStandalone =
        window.matchMedia(
          "(display-mode: standalone)"
        ).matches ||
        (
          window.navigator as any
        ).standalone === true;

      /*
        IMPORTANT:
        FORCE EXTERNAL
        BROWSER AUTH
        FOR IOS PWA
      */

      if (isStandalone) {
        const {
          data,
          error,
        } =
          await supabase.auth.signInWithOAuth(
            {
              provider:
                "discord",

              options: {
                redirectTo,

                scopes:
                  "identify email guilds",

                skipBrowserRedirect:
                  true,
              },
            }
          );

        if (error) {
          throw error;
        }

        /*
          BREAK OUT OF
          IOS PWA WEBVIEW
        */

        if (data?.url) {
          window.location.href =
            data.url;
        }

        return;
      }

      /*
        NORMAL WEB LOGIN
      */

      await supabase.auth.signInWithOAuth(
        {
          provider:
            "discord",

          options: {
            redirectTo,

            scopes:
              "identify email guilds",
          },
        }
      );
    } catch (error) {
      console.error(
        "DISCORD LOGIN ERROR:",
        error
      );
    }
  }

  /*
    LOGOUT
  */

  async function logout() {
    try {
      setShowConfirm(false);

      await supabase.auth.signOut({
        scope: "local",
      });

      /*
        CLEAR LOCAL CACHE
      */

      localStorage.clear();

      sessionStorage.clear();

      /*
        HARD RESET
      */

      window.location.href = "/";
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }

  /*
    AUTHENTICATED
  */

  if (user) {
    return (
      <>
        <button
          onClick={() =>
            setShowConfirm(true)
          }
          className="glass-hover flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:bg-white/[0.06]"
        >
          <img
            src={
              user.user_metadata
                ?.avatar_url
            }
            alt="Avatar"
            className="h-11 w-11 rounded-full border border-white/10 object-cover"
          />

          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-white">
              {
                user.user_metadata
                  ?.full_name
              }
            </span>

            <span className="text-xs text-zinc-500">
              Connected
            </span>
          </div>
        </button>

        {/* LOGOUT MODAL */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="glass-card w-full max-w-sm rounded-[2rem] p-6">
              <h2 className="text-2xl font-black text-white">
                Logout?
              </h2>

              <p className="mt-3 text-sm text-zinc-400">
                Are you sure you want
                to disconnect your
                TarkIntel profile?
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() =>
                    setShowConfirm(
                      false
                    )
                  }
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/[0.06]"
                >
                  Cancel
                </button>

                <button
                  onClick={logout}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-red-400 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
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

  /*
    UNAUTHENTICATED
  */

  return (
    <button
      onClick={login}
      className="rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
    >
      Login with Discord
    </button>
  );
}

