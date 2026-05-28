import { supabase } from "@/lib/supabase";

export async function loadHideoutProgress(
  profileId: string
) {
  const { data, error } =
    await supabase
      .from(
        "hideout_progress"
      )
      .select("*")
      .eq(
        "profile_id",
        profileId
      );

  if (error) {
    console.error(
      "LOAD HIDEOUT PROGRESS ERROR:",
      error
    );

    return [];
  }

  return data;
}

export async function saveHideoutProgress(
  profileId: string,

  moduleId: string,

  completedLevel: number
) {
  const { error } =
    await supabase
      .from(
        "hideout_progress"
      )
      .upsert(
        {
          profile_id:
            profileId,

          module_id:
            moduleId,

          completed_level:
            completedLevel,

          updated_at:
            new Date().toISOString(),
        },

        {
          onConflict:
            "profile_id,module_id",
        }
      );

  if (error) {
    console.error(
      "SAVE HIDEOUT PROGRESS ERROR:",
      error
    );
  }
}