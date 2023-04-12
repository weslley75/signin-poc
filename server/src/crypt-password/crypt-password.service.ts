import { Injectable } from '@nestjs/common';
import { CryptInterface } from '../@types/crypt.interface';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class CryptPasswordService implements CryptInterface {
  encrypt(value: string): string {
    return hashSync(value, 10);
  }

  validate(value: string, hash: string): boolean {
    return compareSync(value, hash);
  }
}
