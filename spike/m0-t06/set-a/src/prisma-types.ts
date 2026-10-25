// T6: types from the Prisma 7 generated client must compile under the TS major
// under test. Type-only: no database connection is made.
import type { Character, Prisma } from "../generated/prisma/client";

export function describeCharacter(c: Character): string {
  return `${c.name} (lv ${c.level})`;
}

export const createInput: Prisma.CharacterCreateInput = { name: "test" };
