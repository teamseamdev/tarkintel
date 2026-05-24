import { supabase } from "@/lib/supabase";

export async function loadTaskProgress(
  profileId: string
) {
  const { data, error } =
    await supabase
      .from("task_progress")
      .select("*")
      .eq(
        "profile_id",
        profileId
      );

  if (error) {
    console.error(error);

    return [];
  }

  return data;
}

export async function saveTaskProgress(
  profileId: string,

  taskId: string,

  completed: boolean
) {
  const { error } =
    await supabase
      .from("task_progress")
      .upsert(
        {
          profile_id:
            profileId,

          task_id: taskId,

          completed,

          completed_at:
            completed
              ? new Date().toISOString()
              : null,
        },

        {
          onConflict:
            "profile_id,task_id",
        }
      );

  if (error) {
    console.error(error);
  }
}