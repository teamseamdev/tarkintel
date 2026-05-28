import { supabase } from "@/lib/supabase";

export async function loadTrackedItems(
  profileId: string
) {
  const { data, error } =
    await supabase
      .from("tracked_items")
      .select("*")
      .eq(
        "profile_id",
        profileId
      );

  if (error) {
    console.error(
      "LOAD TRACKED ITEMS ERROR:",
      error
    );

    return [];
  }

  return data;
}

export async function saveTrackedItem(
  profileId: string,

  itemId: string,

  quantity: number
) {
  const { error } =
    await supabase
      .from("tracked_items")
      .upsert(
        {
          profile_id:
            profileId,

          item_id: itemId,

          quantity,
        },

        {
          onConflict:
            "profile_id,item_id",
        }
      );

  if (error) {
    console.error(
      "SAVE TRACKED ITEM ERROR:",
      error
    );
  }
}