enum Method {
  Binding = 0b000000000001,
}

enum MethodClass {
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

  static fromValue(value: number): MessageType {
    const messageType = new MessageType();

    const c0 = (value >>> 4) & 0b01;
    const c1 = (value >>> 7) & 0b10;

    const m0_3 = value & 0b000000001111;
    const m4_6 = (value >>> 1) & 0b000001110000;
    const m7_11 = (value >>> 2) & 0b111110000000;

    messageType.class = c0 + c1;
    messageType.method = m0_3 + m4_6 + m7_11;

    return messageType;
  }
}
