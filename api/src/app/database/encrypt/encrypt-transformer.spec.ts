import { EncryptionTransformer } from './encrypt-transformer';

describe('EncryptionTransformer', () => {
  let service: EncryptionTransformer;
  const secret = 'secret';
  beforeEach(() => {
    service = new EncryptionTransformer({ secretKey: secret });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt and decrypt', () => {
    const value = 'test';
    const encrypted = service.to(value);
    const decrypted = service.from(encrypted);
    expect(decrypted).toEqual(value);
  });

  it('should not be encrypted', () => {
    const encrypted = service.to();
    expect(encrypted).toBeUndefined();
  });

  it('should not be decrypted', () => {
    const encrypted = service.from();
    expect(encrypted).toBeUndefined();
  });
});
