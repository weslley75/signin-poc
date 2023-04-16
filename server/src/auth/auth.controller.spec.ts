import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserTestingModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { bcryptProvider } from '../crypt-password/bcrypt.provider';
import {
  CreateUserInput,
  User,
  UserRepository,
} from '../repositories/user.repository';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let userRepository: UserRepository;
  let userToCreate: CreateUserInput;
  let createdUser: User;

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

    controller = module.get<AuthController>(AuthController);
    userRepository = module.get<UserRepository>(UserRepository);

    userToCreate = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      username: 'testuser',
    };

    createdUser = await userRepository.create(userToCreate);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const res = {
        cookie: jest.fn(),
      };

      await controller.login(
        {
          user: {
            ...createdUser,
            password: undefined,
          },
        },
        res as unknown as Response,
      );

      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        expect.any(String),
        expect.any(Object),
      );
    });
  });

  describe('logout', () => {
    it('should clear the cookie with maxAge equals a 0', async () => {
      const res = {
        clearCookie: jest.fn(),
      };

      await controller.logout(res as unknown as Response);

      expect(res.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.objectContaining({
          maxAge: 0,
        }),
      );
    });
  });

  describe('isUserExist', () => {
    it('should return true if the user exists', async () => {
      const result = await controller.isUserExist(userToCreate.username);

      expect(result).toBe(true);
    });

    it('should return false if the user does not exist', async () => {
      const result = await controller.isUserExist('non-existing-user');

      expect(result).toBe(false);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userToRegister = {
        email: 'example@example.com',
        password: 'password',
        name: 'Example User',
        username: 'exampleuser',
      };

      expect(
        async () => await controller.register(userToRegister),
      ).not.toThrow();
    });

    it('should throw an error if the username already exists', async () => {
      expect(
        async () => await controller.register(userToCreate),
      ).rejects.toThrow('Username already exists');
    });

    it('should throw an error if the email already exists', async () => {
      const userToRegister = {
        ...userToCreate,
        username: 'exampleuser',
      };

      expect(
        async () => await controller.register(userToRegister),
      ).rejects.toThrow('Email already exists');
    });
  });
});
