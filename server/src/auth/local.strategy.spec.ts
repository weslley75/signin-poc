import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UserTestingModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { bcryptProvider } from '../crypt-password/bcrypt.provider';
import {
  CreateUserInput,
  User,
  UserRepository,
} from '../repositories/user.repository';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let userRepository: UserRepository;
  let userToCreate: CreateUserInput;
  let createdUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserTestingModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '10 minutes' },
        }),
      ],
      providers: [LocalStrategy, AuthService, bcryptProvider],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    userRepository = module.get<UserRepository>(UserRepository);

    userToCreate = {
      email: 'example@example.com',
      password: 'password',
      name: 'John Doe',
      username: 'john',
    };

    createdUser = await userRepository.create(userToCreate);
  });

  describe('validate', () => {
    it('should return user if credentials are valid', async () => {
      const result = await strategy.validate('john', 'password');

      expect(result).toEqual({
        ...createdUser,
        password: undefined,
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      await expect(strategy.validate('john', 'password1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
