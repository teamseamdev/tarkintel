import { supabase } from "@/lib/supabase";

import { User } from "@supabase/supabase-js";

export async function ensureProfile(
  user: User
) {
  const discordId =
    user.user_metadata
      ?.provider_id ||
    user.id;

  const username =
    user.user_metadata
      ?.full_name ||
    user.user_metadata?.name ||
    "Unknown User";

  const avatarUrl =
    user.user_metadata
      ?.avatar_url || null;

  const { data: existing } =
    await supabase
      .from("profiles")
      .select("*")
      .eq(
        "discord_id",
        discordId
      )
      .single();

  if (existing) {
    return existing;
  }

  const { data, error } =
    await supabase
      .from("profiles")
      .insert({
        discord_id: discordId,

        username,

        avatar_url: avatarUrl,
      })
      .select()
      .single();

  if (error) {
    console.error(
      "Profile creation failed:",
      error
    );

    return null;
  }

  return data;
}