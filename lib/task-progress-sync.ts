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
    console.error(
      "LOAD TASK PROGRESS ERROR:",
      error
    );

    return [];
  }

  return data;
}

export async function saveTaskProgress(
  profileId: string,

  taskId: string,

  completed: boolean
) {
  console.log(
    "Saving task progress:",
    {
      profileId,

      taskId,

      completed,
    }
  );

  const { data, error } =
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
      )
      .select();

  if (error) {
    console.error(
      "SAVE TASK PROGRESS ERROR:",
      error
    );

    return;
  }

  console.log(
    "TASK SAVE SUCCESS:",
    data
  );
}

export async function saveTaskProgressBulk(
  profileId: string,
  taskIds: string[]
) {
  const uniqueTaskIds = Array.from(
    new Set(taskIds.filter(Boolean))
  );

  if (uniqueTaskIds.length === 0) {
    return;
  }

  const completedAt = new Date().toISOString();
  const { error } = await supabase
    .from("task_progress")
    .upsert(
      uniqueTaskIds.map((taskId) => ({
        profile_id: profileId,
        task_id: taskId,
        completed: true,
        completed_at: completedAt,
      })),
      {
        onConflict: "profile_id,task_id",
      }
    );

  if (error) {
    console.error(
      "BULK SAVE TASK PROGRESS ERROR:",
      error
    );

    throw error;
  }
}
