export type CreateUserInput = {
  email: string;
  username: string;
  name: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class UserRepository {
  abstract findByUsernameOrEmail(username: string): Promise<User | undefined>;
  abstract create(data: CreateUserInput): Promise<User>;
}
