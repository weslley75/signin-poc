import { Test, TestingModule } from '@nestjs/testing';
import { CryptPasswordService } from './crypt-password.service';

describe('CryptPasswordService', () => {
  let service: CryptPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptPasswordService],
    }).compile();

    service = module.get<CryptPasswordService>(CryptPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
