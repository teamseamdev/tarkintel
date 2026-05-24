import { items } from "@/data/items/items";

export function getItemById(id: string) {
  return items[id];
}