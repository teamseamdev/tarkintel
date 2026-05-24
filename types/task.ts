import { ItemReference } from "./item";

export interface TarkovTask {
  id: string;

  trader: string;

  name: string;

  kappaRequired: boolean;

  objectives: string[];

  rewards?: string[];

  requiredItems?: ItemReference[];

  prerequisites?: string[];

  unlocks?: string[];

  maps?: string[];

  xp?: number;

  reputation?: number;

  levelRequired?: number;

  completed?: boolean;
}