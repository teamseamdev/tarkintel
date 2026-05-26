import { TarkovItem } from "@/types/item";

export const medicalItems: Record<
  string,
  TarkovItem
> = {
  salewa: {
    id: "salewa",

    name: "Salewa first aid kit",

    shortName: "Salewa",

    category: "medical",

    fleaBanned: false,

    avgPrice: 30000,

    usedInTasks: [],

    usedInHideout: [],

    usedInCrafts: [],

    icon: "/items/salewa.png",
  },
};