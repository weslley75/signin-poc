import { Injectable } from '@nestjs/common';
import { CryptPasswordService } from './crypt-password.service';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class BcryptService implements CryptPasswordService {
  encrypt(value: string): string {
    return hashSync(value, 10);
  }

  validate(value: string, hash: string): boolean {
    return compareSync(value, hash);
  }
}
