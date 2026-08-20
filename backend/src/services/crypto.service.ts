import bcrypt from "bcrypt";

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export interface ICryptoService {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}

class CryptoService implements ICryptoService {
  hash(value: string): Promise<string> {
    return bcrypt.hash(value, BCRYPT_ROUNDS);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}

export const cryptoService: ICryptoService = new CryptoService();
