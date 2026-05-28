import { getItems } from "@/lib/item-provider";

export async function getItemById(
  id: string
) {
  const items =
    await getItems();

  return items.find(
    (item) =>
      item.id === id
  );
}