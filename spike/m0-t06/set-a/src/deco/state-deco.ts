// T2b: Colyseus @type() decorator style. Needs legacy experimentalDecorators and
// useDefineForClassFields: false (see tsconfig.deco.json).
import { MapSchema, Schema, type } from "@colyseus/schema";

export class DPlayer extends Schema {
  @type("number") x = 0;
  @type("number") y = 0;
}

export class DGameState extends Schema {
  @type("number") tick = 0;
  @type({ map: DPlayer }) players = new MapSchema<DPlayer>();
}
