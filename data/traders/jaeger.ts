import { TarkovTask } from "@/types/task";

export const jaegerTasks: TarkovTask[] = [
  {
    id: "acquaintance",

    trader: "Jaeger",

    name: "Acquaintance",

    kappaRequired: true,

    levelRequired: 2,

    objectives: [
      "Find 3 Iskra ration packs in raid",
      "Find 2 Packs of instant noodles in raid",
      "Find 2 Cans of beef stew (Large) in raid",
    ],

    requiredItems: [
      {
        itemId: "Iskra ration pack",
        amount: 3,
        foundInRaid: true,
      },

      {
        itemId: "Pack of instant noodles",
        amount: 2,
        foundInRaid: true,
      },

      {
        itemId: "Can of beef stew (Large)",
        amount: 2,
        foundInRaid: true,
      },
    ],

    rewards: [
      "50,000 Roubles",
      "Jaeger Rep +0.01",
      "3,900 XP",
    ],

    maps: [
      "Woods",
      "Customs",
      "Interchange",
    ],

    xp: 3900,

    reputation: 0.01,
  },

  {
    id: "the-survivalist-path-unprotected-but-dangerous",

    trader: "Jaeger",

    name: "The Survivalist Path - Unprotected, But Dangerous",

    kappaRequired: true,

    levelRequired: 5,

    objectives: [
      "Kill 5 Scavs on Woods without body armor",
    ],

    rewards: [
      "60,000 Roubles",
      "Jaeger Rep +0.02",
      "5,200 XP",
    ],

    maps: ["Woods"],

    xp: 5200,

    reputation: 0.02,
  },

  {
    id: "tarkov-shooter-part-1",

    trader: "Jaeger",

    name: "Tarkov Shooter Part 1",

    kappaRequired: true,

    levelRequired: 7,

    objectives: [
      "Kill 5 Scavs with a bolt-action rifle at over 40m",
    ],

    rewards: [
      "75,000 Roubles",
      "Jaeger Rep +0.02",
      "6,800 XP",
    ],

    maps: [
      "Woods",
      "Shoreline",
      "Customs",
    ],

    xp: 6800,

    reputation: 0.02,
  },
];