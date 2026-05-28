import {
  getItems,
} from "@/lib/item-provider";

import { ItemsClient }
from "@/components/items/ItemsClient";

export default async function ItemsPage() {
  const items =
    await getItems();

  return (
    <ItemsClient
      items={items}
    />
  );
}