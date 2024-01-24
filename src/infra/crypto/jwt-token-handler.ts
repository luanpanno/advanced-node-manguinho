import { sign } from 'jsonwebtoken';

import { TokenGenerator } from '@/domain/contracts/crypto/token';

export class JwtTokenHandler implements TokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken({
    expirationInMs,
    key,
  }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000;
    const token = sign({ key }, this.secret, {
      expiresIn: expirationInSeconds,
    });

    return token;
  }
}
