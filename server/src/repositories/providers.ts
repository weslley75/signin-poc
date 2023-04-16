import { Provider } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserInMemoryRepository } from './in-memory/user-in-memory.repository';
import { UserPrismaRepository } from './prisma/user-prisma.repository';

type RepositoryName = 'user';

type ProviderObject = Record<RepositoryName, Provider>;

export const inMemoryRepositories: ProviderObject = {
  user: {
    provide: UserRepository,
    useClass: UserInMemoryRepository,
  },
};

export const prismaRepositories: ProviderObject = {
  user: {
    provide: UserRepository,
    useClass: UserPrismaRepository,
  },
};
