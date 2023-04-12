export abstract class CryptInterface {
  abstract encrypt(value: string): string;
  abstract validate(value: string, hash: string): boolean;
}