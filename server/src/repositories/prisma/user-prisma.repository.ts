import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserInput, UserRepository } from '../user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CryptPasswordService } from '../../crypt-password/crypt-password.service';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  private logger = new Logger(UserPrismaRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptPassword: CryptPasswordService,
  ) {}

  async findByUsernameOrEmail(username: string) {
    return this.prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
    });
  }

  async create(data: CreateUserInput) {
    data.password = this.cryptPassword.encrypt(data.password);
    return this.prisma.user.create({ data }).catch((error) => {
      this.logger.error(error, error.stack);
      throw new BadRequestException(error.message, error);
    });
  }
}
