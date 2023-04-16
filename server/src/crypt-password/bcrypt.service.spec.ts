import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('CryptPasswordService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'password';
      const hashedPassword = service.encrypt(password);

      expect(hashedPassword).not.toEqual(password);
    });
  });

  describe('validate', () => {
    it('should validate a password', async () => {
      const password = 'password';
      const hashedPassword = service.encrypt(password);

      expect(service.validate(password, hashedPassword)).toBe(true);
    });
  });
});
