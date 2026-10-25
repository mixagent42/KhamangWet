// T2a: Colyseus schema() style (no decorators). Recommended by @colyseus/schema 5 README.
import { type SchemaType, schema, t } from "@colyseus/schema";

export const Player = schema(
  {
    x: t.number(),
    y: t.number(),
  },
  "Player",
);
export type Player = SchemaType<typeof Player>;

export const GameState = schema(
  {
    tick: t.number(),
    players: t.map(Player),
  },
  "GameState",
);
export type GameState = SchemaType<typeof GameState>;
