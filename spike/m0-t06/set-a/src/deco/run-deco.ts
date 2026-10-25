// T2b runtime check: compiled by tsc (tsconfig.deco.json) and run with plain Node,
// so the result does not depend on how Vite/Vitest transform decorators.
import { Decoder, Encoder } from "@colyseus/schema";
import { DGameState, DPlayer } from "./state-deco.js";

const state = new DGameState();
state.tick = 7;
const p = new DPlayer();
p.x = 1.5;
p.y = -2;
state.players.set("a", p);

const bytes = new Encoder(state).encodeAll();
const target = new DGameState();
new Decoder(target).decode(bytes);

const got = { tick: target.tick, x: target.players.get("a")?.x, y: target.players.get("a")?.y };
const ok = got.tick === 7 && got.x === 1.5 && got.y === -2;
console.log(JSON.stringify({ test: "T2b-decorator-roundtrip", bytes: bytes.length, got, ok }));
process.exit(ok ? 0 : 1);
