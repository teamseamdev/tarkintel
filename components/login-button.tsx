"use client";

import { supabase } from "@/lib/supabase";

import { useAuth } from "@/hooks/use-auth";

export default function LoginButton() {
  const { user } = useAuth();

  async function login() {
    await supabase.auth.signInWithOAuth(
      {
        provider: "discord",
      }
    );
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (user) {
    return (
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
            onClick={logout}
            className="text-left text-xs text-red-400 transition hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </div>
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