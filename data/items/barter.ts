import { TarkovItem } from "@/types/item";

export const barterItems: Record<
  string,
  TarkovItem
> = {
  bolts: {
    id: "bolts",

    name: "Bolts",

    shortName: "Bolts",

    category: "building",

    fleaBanned: false,

    avgPrice: 23000,

    usedInTasks: [],

    usedInHideout: [],

    usedInCrafts: [],

    icon: "/items/bolts.png",
  },
};