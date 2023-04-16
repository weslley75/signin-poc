import { Provider } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { CryptPasswordService } from './crypt-password.service';

export const bcryptProvider: Provider = {
  provide: CryptPasswordService,
  useClass: BcryptService,
};
