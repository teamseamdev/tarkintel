import { Item } from "@/types/item";

export const provisionItems: Record<
  string,
  Item
> = {
  iskra: {
    id: "iskra",

    name: "Iskra ration pack",

    shortName: "Iskra",

    category: "provision",

    fleaBanned: false,

    avgPrice: 18000,

    usedInTasks: [
      "acquaintance",
    ],

    usedInHideout: [],

    usedInCrafts: [],

    icon: "/items/iskra.png",
  },
};