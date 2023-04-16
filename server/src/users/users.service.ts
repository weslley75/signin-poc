import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';

type CreateUserInput = Omit<User, 'createdAt' | 'updatedAt' | 'id'>;

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findByUsernameOrEmail(username);
  }

  async create(data: CreateUserInput): Promise<User> {
    return this.userRepository.create(data);
  }
}
