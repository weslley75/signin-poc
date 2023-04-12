import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CryptPasswordModule } from '../crypt-password/crypt-password.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [CryptPasswordModule],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
