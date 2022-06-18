export const MAGIC_COOKIE = 0x2112A442;

export enum Method {
  Binding = 0b000000000001,
}

export enum MethodClass {
  Request = 0b00,
  Indication = 0b01,
  SuccessResponse = 0b10,
  ErrorResponse = 0b11,
}

/**
 * ```plaintext
 * The STUN Message Type field is decomposed further into the following
 * structure:
 *                     0                 1
 *                     2  3  4 5 6 7 8 9 0 1 2 3 4 5
 *                    +--+--+-+-+-+-+-+-+-+-+-+-+-+-+
 *                    |M |M |M|M|M|C|M|M|M|C|M|M|M|M|
 *                    |11|10|9|8|7|1|6|5|4|0|3|2|1|0|
 *                    +--+--+-+-+-+-+-+-+-+-+-+-+-+-+
 *
 *             Figure 3: Format of STUN Message Type Field
 * ```
 */
export class MessageType {
  method: Method;
  class: MethodClass;

  constructor() {
    this.method = Method.Binding;
    this.class = MethodClass.Request;
  }

  toValue(): number {
    const m3_0 = this.method & 0b000000001111;
    const m6_4 = this.method & 0b000001110000;
    const m11_7 = this.method & 0b111110000000;

    const c0 = (this.class & 0b01) << 4;
    const c1 = (this.class & 0b10) << 7;

    return m11_7 + c1 + m6_4 + c0 + m3_0;
  }

  static FromValue(value: number): MessageType {
    const messageType = new MessageType();

    const c0 = (value >>> 4) & 0b01;
    const c1 = (value >>> 7) & 0b10;

    const m3_0 = value & 0b000000001111;
    const m6_4 = (value >>> 1) & 0b000001110000;
    const m11_7 = (value >>> 2) & 0b111110000000;

    messageType.class = c1 + c0;
    messageType.method = m11_7 + m6_4 + m3_0;

    return messageType;
  }
}

export class MessageHeader {
  type: MessageType;
  length: number;
  magicCookie: number;
  transactionId: Uint8Array;
}

export class Message {
  header: MessageHeader;
  attributes: unknown[];
}
