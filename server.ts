import { copy } from "https://deno.land/std@0.144.0/streams/conversion.ts";

// IANA: https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=stun
export const STUN_PORT = 3478;
const MTU = 548;
// const STUNS_PORTS = 5349;

export class Server {
  #listener?: Deno.Listener;
  // constructor() {}

  async start() {
    const listener = Deno.listen({ port: STUN_PORT });
    console.log(`Listening on port ${STUN_PORT}`);
    console.log(listener.addr);

    this.#listener = listener;

    const buf = new Uint8Array(MTU);

    for await (const conn of listener) {
      const n = await conn.read(buf) ?? 0;
      console.log(buf.slice(0, n));

      await conn.write(buf.slice(0, n));
      conn.close();
      // copy(conn, conn).finally(() => conn.close());
    }
  }

  stop() {
    this.#listener?.close();
  }
}
