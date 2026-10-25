// T3: server on 127.0.0.1 + @colyseus/sdk clients.
import { CloseCode, Server } from "@colyseus/core";
import { Client } from "@colyseus/sdk";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { afterAll, beforeAll, expect, it } from "vitest";
import { TestRoom } from "./room";
import { GameState } from "./state-fn";

let server: Server;
const port = 20000 + Math.floor(Math.random() * 20000);
const url = `ws://127.0.0.1:${port}`;

async function waitFor(check: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error("waitFor timed out");
    await new Promise((r) => setTimeout(r, 10));
  }
}

beforeAll(async () => {
  server = new Server({ transport: new WebSocketTransport(), greet: false });
  server.define("test", TestRoom);
  await server.listen(port, "127.0.0.1");
});

afterAll(async () => {
  await server.gracefullyShutdown(false);
});

it("T3a syncs state; manual safeParse drops invalid input without disconnecting", async () => {
  const room = await new Client(url).joinOrCreate("test", {}, GameState);
  let left = false;
  room.onLeave(() => {
    left = true;
  });
  const me = () => room.state.players?.get(room.sessionId);
  await waitFor(() => me() !== undefined);

  room.send("move2", { seq: 1, dx: 1, dy: 0 });
  await waitFor(() => me()?.x === 1);

  room.send("move2", { seq: 2, dx: 999, dy: 0 });
  room.send("move2", { seq: 3, dx: 0, dy: 0, damage: 9999 });
  room.send("move2", "garbage");
  room.send("move2", { seq: 4, dx: 0.5, dy: 0 });
  await waitFor(() => me()?.x === 1.5);

  expect(me()?.x).toBe(1.5);
  expect(left).toBe(false);
  await room.leave();
});

it("T3b built-in validation disconnects the sender; the room keeps serving others", async () => {
  const a = await new Client(url).joinOrCreate("test", {}, GameState);
  const b = await new Client(url).joinOrCreate("test", {}, GameState);
  expect(b.roomId).toBe(a.roomId);

  let aLeaveCode: number | undefined;
  a.onLeave((code) => {
    aLeaveCode = code;
  });
  const bMe = () => b.state.players?.get(b.sessionId);
  await waitFor(() => bMe() !== undefined);

  a.send("move", { seq: 1, dx: 999, dy: 0 });
  await waitFor(() => aLeaveCode !== undefined);
  expect(aLeaveCode).toBe(CloseCode.WITH_ERROR);

  b.send("move", { seq: 1, dx: 1, dy: 0 });
  await waitFor(() => bMe()?.x === 1);
  expect(bMe()?.x).toBe(1);
  expect(b.state.players.get(a.sessionId)).toBeUndefined();
  await b.leave();
});
