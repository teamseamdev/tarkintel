import { barterItems } from "./barter";
import { provisionItems } from "./provisions";
import { medicalItems } from "./medical";

export const items = {
  ...barterItems,

  ...provisionItems,

  ...medicalItems,
};