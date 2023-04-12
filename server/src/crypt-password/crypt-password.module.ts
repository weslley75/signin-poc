import { Module } from '@nestjs/common';
import { CryptPasswordService } from './crypt-password.service';

@Module({
  providers: [CryptPasswordService],
  exports: [CryptPasswordService],
})
export class CryptPasswordModule {}
