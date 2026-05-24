"use client";

import { supabase } from "@/lib/supabase";

export default function LoginButton() {
  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
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