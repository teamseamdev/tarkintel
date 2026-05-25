const LEVEL_XP: Record<
  number,
  number
> = {
  1: 0,
  2: 1000,
  3: 4017,
  4: 8432,
  5: 14256,
  6: 21477,
  7: 30023,
  8: 39936,
  9: 51204,
  10: 63866,
  11: 77963,
  12: 93537,
  13: 110632,
  14: 129295,
  15: 149576,
  16: 171529,
  17: 195210,
  18: 220676,
  19: 247988,
  20: 277206,
};

export function getLevelFromXP(
  xp: number
) {
  let level = 1;

  for (const [
    lvl,
    requiredXP,
  ] of Object.entries(
    LEVEL_XP
  )) {
    if (
      xp >= requiredXP
    ) {
      level =
        Number(lvl);
    }
  }

  return level;
}