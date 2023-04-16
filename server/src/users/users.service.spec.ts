import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { BcryptService } from '../crypt-password/bcrypt.service';
import { CryptPasswordService } from '../crypt-password/crypt-password.service';
import { bcryptProvider } from '../crypt-password/bcrypt.provider';
import { inMemoryRepositories } from '../repositories/providers';

describe('UsersService', () => {
  let service: UsersService;
  let cryptoService: BcryptService;
  let userToCreate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, inMemoryRepositories.user, bcryptProvider],
      exports: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    cryptoService = module.get<CryptPasswordService>(CryptPasswordService);

    userToCreate = {
      email: 'example2@example.com',
      username: 'example2',
      password: 'password',
      name: 'Example',
    };

    await service.create(userToCreate);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userToCreate = {
        email: 'example@example.com',
        username: 'example',
        password: 'password',
        name: 'Example',
      };
      const user = await service.create(userToCreate);

      expect(user).toEqual({
        id: expect.any(String),
        email: userToCreate.email,
        username: userToCreate.username,
        name: userToCreate.name,
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(user.password).not.toEqual(userToCreate.password);
      expect(cryptoService.validate(userToCreate.password, user.password)).toBe(
        true,
      );
    });

    it('should throw an error if the user already exists', async () => {
      await expect(service.create(userToCreate)).rejects.toThrowError(
        'Username already exists',
      );
    });

    it('should throw an error if the email is already in use', async () => {
      await expect(
        service.create({
          ...userToCreate,
          username: 'example3',
        }),
      ).rejects.toThrowError('Email already exists');
    });
  });

  describe('findByUsernameOrEmail', () => {
    it('should find a user by username', async () => {
      const user = await service.findOne('example2');

      expect(user).toEqual({
        id: expect.any(String),
        email: userToCreate.email,
        username: userToCreate.username,
        name: userToCreate.name,
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should find a user by email', async () => {
      const user = await service.findOne(userToCreate.email);

      expect(user).toEqual({
        id: expect.any(String),
        email: userToCreate.email,
        username: userToCreate.username,
        name: userToCreate.name,
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
