import {
  getHideoutModules,
} from "@/lib/hideout-provider";

import {
  getItems,
} from "@/lib/item-provider";

import {
  HideoutPlannerClient,
} from "@/components/hideout/HideoutPlannerClient";

export async function HideoutLoader() {
  const [
    modules,
    items,
  ] = await Promise.all([
    getHideoutModules(),
    getItems(),
  ]);

  return (
    <HideoutPlannerClient
      modules={modules}
      items={items}
    />
  );
}