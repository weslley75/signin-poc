import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { bcryptProvider } from '../crypt-password/bcrypt.provider';
import {
  inMemoryRepositories,
  prismaRepositories,
} from '../repositories/providers';

@Module({
  providers: [
    UsersService,
    PrismaService,
    prismaRepositories.user,
    bcryptProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}

@Module({
  providers: [UsersService, inMemoryRepositories.user, bcryptProvider],
  exports: [UsersService],
})
export class UserTestingModule {}
