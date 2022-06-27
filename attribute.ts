export enum AttributeType {
  // Comprehension-required range (0x0000-0x7FFF):
  MappedAddress = 0x0001,
  Username = 0x0006,
  MessageIntegrity = 0x0008,
  ErrorCode = 0x0009,
  UnknownAttributes = 0x000A,
  Realm = 0x0014,
  Nonce = 0x0015,
  MessageIntegritySha256 = 0x001C,
  PasswordAlgorithm = 0x001D,
  UserHash = 0x001E,
  XorMappedAddress = 0x0020,

  // Comprehension-optional range (0x8000-0xFFFF):
  PasswordAlgorithms = 0x8002,
  AlternateDomain = 0x8003,
  Software = 0x8022,
  AlternateServer = 0x8023,
  Fingerprint = 0x8028,
}

export class Attribute {
  #view: DataView;

  get type(): AttributeType {
    return this.#view.getUint16(0);
  }

  get length(): number {
    return this.#view.getUint16(2);
  }

  get value(): DataView {
    return new DataView(
      this.#view.buffer,
      this.#view.byteOffset + 4,
      this.length,
    );
  }

  constructor(view: DataView) {
    this.#view = view;
  }

  // static FromValue(value: number): Attribute {
  //   const attribute = new Attribute();

  //   const t0 = value & 0b00_0000_0000_1111;
  //   const t1 = (value >>> 4) & 0b00_0000_0000_1111;

  //   attribute.type = t1 + t0;
  //   attribute.value = value >>> 8;

  //   return attribute;
  // }
}

export class Attributes {}
