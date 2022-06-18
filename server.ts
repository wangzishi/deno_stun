import { copy } from "https://deno.land/std@0.144.0/streams/conversion.ts";

// IANA: https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=stun
const STUN_PORT = 3478;
// const STUNS_PORTS = 5349;

export class Server {
  // constructor() {}

  async start() {
    const listener = Deno.listen({ port: STUN_PORT });
    console.log(`Listening on port ${STUN_PORT}`);
    console.log(listener.addr);
    for await (const conn of listener) {
      copy(conn, conn).finally(() => conn.close());
    }
  }
}

// const server = new Server();
// server.start();
