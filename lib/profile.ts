import { supabase } from "@/lib/supabase";

export async function loadProfile(
  profileId: string
) {
  const { data, error } =
    await supabase
      .from("profiles")
      .select(`
        player_level_override
      `)
      .eq("id", profileId)
      .single();

  if (error) {
    console.error(
      "LOAD PROFILE ERROR:",
      error
    );

    return null;
  }

  return data;
}

export async function updatePlayerLevelOverride(
  profileId: string,

  level: number | null
) {
  const { error } =
    await supabase
      .from("profiles")
      .update({
        player_level_override:
          level,
      })
      .eq("id", profileId);

  if (error) {
    console.error(
      "UPDATE PLAYER LEVEL ERROR:",
      error
    );
  }
}