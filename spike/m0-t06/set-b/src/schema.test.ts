// T2a runtime: schema() state survives an encode/decode round trip.
import { Decoder, Encoder } from "@colyseus/schema";
import { expect, it } from "vitest";
import { GameState, Player } from "./state-fn";

it("T2a round-trips schema() state through Encoder/Decoder", () => {
  const state = new GameState();
  state.tick = 7;
  const p = new Player();
  p.x = 1.5;
  p.y = -2;
  state.players.set("a", p);

  const bytes = new Encoder(state).encodeAll();
  const target = new GameState();
  new Decoder(target).decode(bytes);

  expect(target.tick).toBe(7);
  expect(target.players.get("a")?.x).toBe(1.5);
  expect(target.players.get("a")?.y).toBe(-2);
});
