import { ValueTransformer } from 'typeorm';
const Cryptr = require('cryptr');
export class EncryptionTransformer implements ValueTransformer {
  private cryptr;

  constructor(options: { secretKey: string }) {
    this.cryptr = new Cryptr(options.secretKey);
  }

  from(value?: string | null): string | undefined {
    if (!value) {
      return;
    }
    return this.cryptr.decrypt(value);
  }

  to(value?: string | null): string | undefined {
    if ((value ?? null) === null) {
      return;
    }

    return this.cryptr.encrypt(value);
  }
}
