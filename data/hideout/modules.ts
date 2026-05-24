import { ItemReference } from "@/types/item";

interface HideoutModule {
  id: string;

  name: string;

  level: number;

  requiredItems: ItemReference[];

  requiredLevel: number;
}

export const hideoutModules: HideoutModule[] = [
  {
    id: "nutrition-unit-1",

    name: "Nutrition Unit Level 1",

    level: 1,

    requiredItems: [
      {
        itemId: "iskra",
        amount: 1,
      },

      {
        itemId: "instant-noodles",
        amount: 1,
      },

      {
        itemId: "beef-stew-large",
        amount: 1,
      },
    ],

    requiredLevel: 1,
  },

  {
    id: "medstation-1",

    name: "Medstation Level 1",

    level: 1,

    requiredItems: [
      {
        itemId: "salewa",
        amount: 1,
      },
    ],

    requiredLevel: 1,
  },

  {
    id: "generator-1",

    name: "Generator Level 1",

    level: 1,

    requiredItems: [
      {
        itemId: "spark-plug",
        amount: 1,
      },

      {
        itemId: "bolts",
        amount: 2,
      },
    ],

    requiredLevel: 1,
  },
];