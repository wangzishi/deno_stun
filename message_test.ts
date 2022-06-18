import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";

import {
  MAGIC_COOKIE,
  MessageHeader,
  MessageType,
  Method,
  MethodClass,
} from "./message.ts";

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
  const length = Math.random() * 65535 | 0;

  view.setUint8(0, 0x01);
  view.setUint8(1, 0x01);
  view.setUint16(2, length);
  view.setUint32(4, MAGIC_COOKIE);

  const messageHeader = new MessageHeader(buffer);

  assertEquals(messageHeader.type.method, Method.Binding);
  assertEquals(messageHeader.type.class, MethodClass.SuccessResponse);
  assertEquals(messageHeader.length, length);
  assertEquals(messageHeader.magicCookie, MAGIC_COOKIE);
  assertEquals(messageHeader.transactionId, randomId);
});
