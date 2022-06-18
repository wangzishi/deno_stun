import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";
import { MessageType, Method, MethodClass } from "./message.ts";

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
