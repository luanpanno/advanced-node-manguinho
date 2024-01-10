import { sign } from 'jsonwebtoken';

import { TokenGenerator } from '@/data/contracts/crypto/token';

export class JwtTokenGenerator {
  constructor(private readonly secret: string) {}

  generateToken(params: TokenGenerator.Params): TokenGenerator.Result {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });

    return token;
  }
}
