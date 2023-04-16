import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CryptPasswordService } from '../crypt-password/crypt-password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cryptPasswordService: CryptPasswordService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && this.cryptPasswordService.validate(pass, user.password)) {
      return {
        ...user,
        password: undefined,
      };
    }
    return null;
  }

  async isUserExist(usernameOrEmail: string): Promise<boolean> {
    const user = await this.usersService.findOne(usernameOrEmail);
    return !!user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  register(user: any) {
    return this.usersService.create(user);
  }
}
