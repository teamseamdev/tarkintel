import { supabase } from "@/lib/supabase";

import type {
  User,
} from "@supabase/supabase-js";

export async function ensureProfile(
  user: User
) {
  /*
    PROFILE ID
    MUST MATCH AUTH UID
  */

  const profileId =
    user.id;

  /*
    DISCORD INFO
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
    FIND PROFILE
  */

  const {
    data: existingProfiles,
    error: fetchError,
  } =
    await supabase
      .from("profiles")
      .select("*")
      .eq(
        "id",
        profileId
      )
      .limit(1);

  if (fetchError) {
    console.error(
      "PROFILE FETCH ERROR:",
      fetchError
    );
  }

  /*
    EXISTING
  */

  const existing =
    existingProfiles?.[0];

  if (existing) {
    return existing;
  }

  /*
    CREATE
  */

  const {
    data,
    error,
  } =
    await supabase
      .from("profiles")
      .insert({
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
      "PROFILE CREATION ERROR:",
      error
    );

    /*
      RETRY FETCH
    */

    const {
      data: retryProfiles,
    } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          profileId
        )
        .limit(1);

    return (
      retryProfiles?.[0] ||
      null
    );
  }

  return data;
}