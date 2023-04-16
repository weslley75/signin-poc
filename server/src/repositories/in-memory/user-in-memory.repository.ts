import { Injectable } from '@nestjs/common';
import { CreateUserInput, User, UserRepository } from '../user.repository';
import { randomUUID } from 'crypto';
import { CryptPasswordService } from '../../crypt-password/crypt-password.service';

@Injectable()
export class UserInMemoryRepository implements UserRepository {
  private users: User[] = [];

  constructor(private readonly cryptPassword: CryptPasswordService) {}

  async findByUsernameOrEmail(username: string) {
    return this.users.find(
      (user) => user.username === username || user.email === username,
    );
  }

  async create(data: CreateUserInput) {
    if (this.users.find((user) => user.username === data.username)) {
      throw new Error('Username already exists');
    }
    if (this.users.find((user) => user.email === data.email)) {
      throw new Error('Email already exists');
    }
    const user = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      password: this.cryptPassword.encrypt(data.password),
    };
    this.users.push(user);
    return user;
  }
}
