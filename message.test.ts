import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";

import {
  MAGIC_COOKIE,
  Message,
  MessageHeader,
  MessageType,
  Method,
  MethodClass,
} from "./message.ts";

/**
 * This request uses the following parameters:
 *
 * Username: "<U+30DE><U+30C8><U+30EA><U+30C3><U+30AF><U+30B9>" (without quotes) unaffected by OpaqueString [RFC8265] processing
 *
 * Password: "The<U+00AD>M<U+00AA>tr<U+2168>" and "TheMatrIX" (without quotes) respectively before and after OpaqueString [RFC8265] processing
 *
 * Nonce: "obMatJos2AAACf//499k954d6OL34oL9FSTvy64sA" (without quotes)
 *
 * Realm: "example.org" (without quotes)
 */
// deno-fmt-ignore
const sample = new Uint8Array([
  0x00, 0x01, 0x00, 0x9c,  //    Request type and message length
  0x21, 0x12, 0xa4, 0x42,  //    Magic cookie
  0x78, 0xad, 0x34, 0x33,  // }
  0xc6, 0xad, 0x72, 0xc0,  // }  Transaction ID
  0x29, 0xda, 0x41, 0x2e,  // }
  0x00, 0x1e, 0x00, 0x20,  //    USERHASH attribute header
  0x4a, 0x3c, 0xf3, 0x8f,  // }
  0xef, 0x69, 0x92, 0xbd,  // }
  0xa9, 0x52, 0xc6, 0x78,  // }
  0x04, 0x17, 0xda, 0x0f,  // }  Userhash value (32 bytes)
  0x24, 0x81, 0x94, 0x15,  // }
  0x56, 0x9e, 0x60, 0xb2,  // }
  0x05, 0xc4, 0x6e, 0x41,  // }
  0x40, 0x7f, 0x17, 0x04,  // }
  0x00, 0x15, 0x00, 0x29,  //    NONCE attribute header
  0x6f, 0x62, 0x4d, 0x61,  // }
  0x74, 0x4a, 0x6f, 0x73,  // }
  0x32, 0x41, 0x41, 0x41,  // }
  0x43, 0x66, 0x2f, 0x2f,  // }
  0x34, 0x39, 0x39, 0x6b,  // }  Nonce value and padding (3 bytes)
  0x39, 0x35, 0x34, 0x64,  // }
  0x36, 0x4f, 0x4c, 0x33,  // }
  0x34, 0x6f, 0x4c, 0x39,  // }
  0x46, 0x53, 0x54, 0x76,  // }
  0x79, 0x36, 0x34, 0x73,  // }
  0x41, 0x00, 0x00, 0x00,  // }
  0x00, 0x14, 0x00, 0x0b,  //    REALM attribute header
  0x65, 0x78, 0x61, 0x6d,  // }
  0x70, 0x6c, 0x65, 0x2e,  // }  Realm value (11 bytes) and padding (1 byte)
  0x6f, 0x72, 0x67, 0x00,  // }
  0x00, 0x1c, 0x00, 0x20,  //    MESSAGE-INTEGRITY-SHA256 attribute header
  0xe4, 0x68, 0x6c, 0x8f,  // }
  0x0e, 0xde, 0xb5, 0x90,  // }
  0x13, 0xe0, 0x70, 0x90,  // }
  0x01, 0x0a, 0x93, 0xef,  // }  HMAC-SHA256 value
  0xcc, 0xbc, 0xcc, 0x54,  // }
  0x4c, 0x0a, 0x45, 0xd9,  // }
  0xf8, 0x30, 0xaa, 0x6d,  // }
  0x6f, 0x73, 0x5a, 0x01,  // }
]);

Deno.test("test MessageType", () => {
  const messageType = new MessageType();
  assertEquals(messageType.method, Method.Binding);
  assertEquals(messageType.class, MethodClass.Request);
});

Deno.test("test MessageType.FromValue", () => {
  const messageType1 = MessageType.FromValue(0x0001);
  assertEquals(messageType1.method, Method.Binding);
  assertEquals(messageType1.class, MethodClass.Request);

  const messageType2 = MessageType.FromValue(0x0101);
  assertEquals(messageType2.method, Method.Binding);
  assertEquals(messageType2.class, MethodClass.SuccessResponse);

  const messageType3 = MessageType.FromValue(0x0111);
  assertEquals(messageType3.method, Method.Binding);
  assertEquals(messageType3.class, MethodClass.ErrorResponse);
});

Deno.test("test MessageType.toValue", () => {
  const messageType = new MessageType();
  assertEquals(messageType.toValue(), 0x0001);

  messageType.class = MethodClass.SuccessResponse;
  assertEquals(messageType.toValue(), 0x0101);

  messageType.class = MethodClass.ErrorResponse;
  assertEquals(messageType.toValue(), 0x0111);
});

Deno.test("test MessageHeader", () => {
  const buffer = new ArrayBuffer(20);
  const view = new DataView(buffer);
  crypto.getRandomValues(new Uint8Array(buffer));

  const randomId = new Uint8Array(buffer.slice(8, 20));
  const length = (Math.random() * 65535) | 0;

  view.setUint8(0, 0x01);
  view.setUint8(1, 0x01);
  view.setUint16(2, length);
  view.setUint32(4, MAGIC_COOKIE);

  const messageHeader = new MessageHeader(view);

  assertEquals(messageHeader.type.method, Method.Binding);
  assertEquals(messageHeader.type.class, MethodClass.SuccessResponse);
  assertEquals(messageHeader.length, length);
  assertEquals(messageHeader.magicCookie, MAGIC_COOKIE);
  // FIXME: Doesn't work as expected behavior
  assertEquals(messageHeader.transactionId, new DataView(randomId.buffer));
});

Deno.test("decode sample message", () => {
  const message = new Message(sample.buffer);

  console.log(message);
});
