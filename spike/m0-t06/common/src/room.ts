// T3: minimal authoritative room with two validation styles:
// - "move":  built-in validation, onMessage(type, zodSchema, handler).
//            Observed in 0.18.23 source: an invalid payload disconnects the sender (CloseCode.WITH_ERROR).
// - "move2": manual safeParse inside the handler, which drops invalid input without disconnecting.
import { type Client, Room } from "@colyseus/core";
import { MoveInput } from "./contracts";
import { GameState, Player } from "./state-fn";

export class TestRoom extends Room {
  state = new GameState();

  onCreate() {
    this.onMessage("move", MoveInput, (client, msg) => {
      this.apply(client, msg.dx, msg.dy);
    });

    this.onMessage("move2", (client, raw: unknown) => {
      const parsed = MoveInput.safeParse(raw);
      if (!parsed.success) return;
      this.apply(client, parsed.data.dx, parsed.data.dy);
    });
  }

  private apply(client: Client, dx: number, dy: number) {
    const p = this.state.players.get(client.sessionId);
    if (!p) return;
    p.x += dx;
    p.y += dy;
  }

  onJoin(client: Client) {
    const p = new Player();
    p.x = 0;
    p.y = 0;
    this.state.players.set(client.sessionId, p);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
  }
}
