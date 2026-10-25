// Shared message schema used by the room (T3) and the Zod tests (T7).
import { z } from "zod";

export const MoveInput = z
  .object({
    seq: z.number().int().nonnegative(),
    dx: z.number().finite().min(-1).max(1),
    dy: z.number().finite().min(-1).max(1),
  })
  .strict();
export type MoveInput = z.infer<typeof MoveInput>;

export const ChatInput = z.object({ text: z.string().min(1).max(256) }).strict();
