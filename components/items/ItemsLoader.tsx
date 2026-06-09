import {
  getItems,
} from "@/lib/item-provider";

import {
  ItemsClient,
} from "@/components/items/ItemsClient";

export async function ItemsLoader() {
  const items =
    await getItems();

  return (
    <ItemsClient
      items={items}
    />
  );
}