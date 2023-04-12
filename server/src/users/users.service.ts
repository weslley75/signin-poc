import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CryptPasswordService } from '../crypt-password/crypt-password.service';

type CreateUserInput = Omit<User, 'createdAt' | 'updatedAt' | 'id'>;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptPassword: CryptPasswordService,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    data.password = this.cryptPassword.encrypt(data.password);
    return this.prisma.user.create({
      data,
    });
  }
}
