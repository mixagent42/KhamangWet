// T7: Zod 4 contract behavior under Vitest 5.
import { expect, it } from "vitest";
import { ChatInput, MoveInput } from "./contracts";

it("T7 accepts a valid move", () => {
  expect(MoveInput.safeParse({ seq: 1, dx: 0.5, dy: -1 }).success).toBe(true);
});

it("T7 rejects out-of-range, non-finite, unknown fields and wrong types", () => {
  expect(MoveInput.safeParse({ seq: 1, dx: 2, dy: 0 }).success).toBe(false);
  expect(MoveInput.safeParse({ seq: 1, dx: Number.NaN, dy: 0 }).success).toBe(false);
  expect(MoveInput.safeParse({ seq: 1, dx: 0, dy: 0, damage: 1 }).success).toBe(false);
  expect(MoveInput.safeParse("garbage").success).toBe(false);
  expect(MoveInput.safeParse({ seq: -1, dx: 0, dy: 0 }).success).toBe(false);
});

it("T7 rejects oversized payloads", () => {
  expect(ChatInput.safeParse({ text: "a".repeat(256) }).success).toBe(true);
  expect(ChatInput.safeParse({ text: "a".repeat(257) }).success).toBe(false);
});
