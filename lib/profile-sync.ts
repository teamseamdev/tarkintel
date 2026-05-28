import { supabase } from "@/lib/supabase";

import type {
  User,
} from "@supabase/supabase-js";

export async function ensureProfile(
  user: User
) {
  /*
    DISCORD DATA
  */

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

  /*
    IMPORTANT:
    PROFILE ID MUST MATCH
    SUPABASE AUTH USER ID
  */

  const profileId =
    user.id;

  /*
    EXISTING PROFILE
  */

  const {
    data: existing,
    error: existingError,
  } =
    await supabase
      .from("profiles")
      .select("*")
      .eq(
        "id",
        profileId
      )
      .single();

  /*
    FOUND
  */

  if (
    existing &&
    !existingError
  ) {
    return existing;
  }

  /*
    CREATE PROFILE
  */

  const {
    data,
    error,
  } =
    await supabase
      .from("profiles")
      .insert({
        /*
          CRITICAL FIX
        */

        id: profileId,

        discord_id:
          discordId,

        username,

        avatar_url:
          avatarUrl,
      })
      .select()
      .single();

  if (error) {
    console.error(
      "PROFILE CREATION FAILED:",
      error
    );

    return null;
  }

  return data;
}