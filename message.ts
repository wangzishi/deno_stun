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
 *
 * M11 through M0 represent a 12-bit encoding of the method.
 * C1 and C0 represent a 2-bit encoding of the class.
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
    const m3_0 = this.method & 0b00_0000_0000_1111;
    const m6_4 = this.method & 0b00_0000_0111_0000;
    const m11_7 = this.method & 0b00_1111_1000_0000;

    const c0 = (this.class & 0b01) << 4;
    const c1 = (this.class & 0b10) << 7;

    return m11_7 + c1 + m6_4 + c0 + m3_0;
  }

  [Symbol.for("Deno.customInspect")](): string {
    return dedent`
      Type { method: ${this.method}, class: ${this.class} }
    `;
  }

  static FromValue(value: number): MessageType {
    const messageType = new MessageType();

    const c0 = (value >>> 4) & 0b01;
    const c1 = (value >>> 7) & 0b10;

    const m3_0 = value & 0b00_0000_0000_1111;
    const m6_4 = (value >>> 1) & 0b00_0000_0111_0000;
    const m11_7 = (value >>> 2) & 0b00_1111_1000_0000;

    messageType.class = c1 + c0;
    messageType.method = m11_7 + m6_4 + m3_0;

    return messageType;
  }
}

export class MessageHeader {
  #view: DataView;

  get type(): MessageType {
    return MessageType.FromValue(this.#view.getUint16(0));
  }

  get length(): number {
    return this.#view.getUint16(2);
  }

  get magicCookie(): number {
    return this.#view.getUint32(4);
  }

  get transactionId(): DataView {
    const byteOffset = this.#view.byteOffset + 8;
    const byteLength = 12;

    return new DataView(this.#view.buffer, byteOffset, byteLength);
  }

  constructor(view: DataView) {
    // this.#buffer = buffer;
    this.#view = view;
  }

  [Symbol.for("Deno.customInspect")](
    inspect: typeof Deno.inspect,
    options: Deno.InspectOptions,
  ): string {
    const id0_3 = this.transactionId.getUint32(0).toString(16);
    const id4_7 = this.transactionId.getUint32(4).toString(16);
    const id8_11 = this.transactionId.getUint32(8).toString(16);

    const id = `0x${id0_3}${id4_7}${id8_11}`;
    return dedent`
      Header {
        type: ${inspect(this.type, options)},
        length: ${this.length},
        magicCookie: ${this.magicCookie},
        transactionId: ${id},
      }
    `;
  }
}

export class Message {
  // #buffer: ArrayBufferLike;
  header: MessageHeader;
  attributes: unknown[];

  constructor(buffer: ArrayBufferLike) {
    // this.#buffer = buffer;
    this.header = new MessageHeader(new DataView(buffer, 0, 20));
    this.attributes = [];
  }

  [Symbol.for("Deno.customInspect")](
    inspect: typeof Deno.inspect,
    options: Deno.InspectOptions,
  ): string {
    return dedent`Message {
      ${inspect(this.header, options)}
    }`;
  }
}
