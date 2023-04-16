import { Test, TestingModule } from '@nestjs/testing';
import { UserTestingModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { bcryptProvider } from '../crypt-password/bcrypt.provider';
import {
  CreateUserInput,
  User,
  UserRepository,
} from '../repositories/user.repository';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  const userToCreate: CreateUserInput = {
    email: 'example@example.com',
    password: 'password',
    name: 'Test User',
    username: 'testuser',
  };

  let userCreated: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserTestingModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '10 minutes' },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy, bcryptProvider],
      exports: [AuthService],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);

    userCreated = await userRepository.create(userToCreate);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const token = await service.login({ id: 1 });
      expect(token).toEqual({
        access_token: expect.any(String),
      });
    });
  });

  describe('isUserExist', () => {
    it('should return true if user exists', async () => {
      const user = await service.isUserExist(userToCreate.username);
      expect(user).toEqual(true);
    });

    it('should return false if user does not exist', async () => {
      const user = await service.isUserExist('testuser2');
      expect(user).toEqual(false);
    });
  });

  describe('validateUser', () => {
    it('should return a user if user exists', async () => {
      const user = await service.validateUser(
        userToCreate.username,
        userToCreate.password,
      );
      expect(user).toEqual({
        ...userCreated,
        password: undefined,
      });
    });

    it('should return null if user does not exist', async () => {
      const user = await service.validateUser('testuser2', 'password');
      expect(user).toEqual(null);
    });
  });
});
