export abstract class CryptPasswordService {
  abstract encrypt(value: string): string;
  abstract validate(value: string, hash: string): boolean;
}
