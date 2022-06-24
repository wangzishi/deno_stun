import { Server, STUN_PORT } from "./server.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.144.0/testing/asserts.ts";

import { Temporal } from "./deps.ts";

// import {
//   describe,
//   it,
//   beforeEach,
//   afterEach,
// } from "https://deno.land/std@0.144.0/testing/bdd.ts";

Deno.test("test Server", async (t) => {
  const server = new Server();
  server.start();

  await t.step("server exists", () => {
    assertExists(server);
  });

  await t.step("connect to server", async () => {
    const conn = await Deno.connect({ port: STUN_PORT });

    const text = Temporal.Now.instant().toLocaleString();

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // console.log(sample.byteLength);
    await conn.write(encoder.encode(text));

    let buf = new Uint8Array(32 * 1024);
    const n = (await conn.read(buf)) ?? 0;

    buf = buf.slice(0, n);

    assertEquals(text, decoder.decode(buf));

    conn.close();
  });

  server.stop();
});

// describe("Server", () => {
//   const server = new Server();

//   beforeEach(() => {
//     server.start();
//   });

//   afterEach(() => {
//     server.stop();
//   });

//   it("should exist", () => {
//     assertExists(server);
//   });
// });

// Deno.test("test", () => {});
