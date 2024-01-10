import jwt from 'jsonwebtoken';

import { TokenGenerator } from '@/data/contracts/crypto/token';

jest.mock('jsonwebtoken');

class JwtTokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000;

    jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });
  }
}

const makeSut = () => {
  const fakeJwt = jwt as jest.Mocked<typeof jwt>;
  const sut = new JwtTokenGenerator('any_secret');

  return {
    sut,
    fakeJwt,
  };
};

describe('JwtTokenGenerator', () => {
  it('should call sign with correct params', async () => {
    const { sut, fakeJwt } = makeSut();

    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      {
        key: 'any_key',
      },
      'any_secret',
      {
        expiresIn: 1,
      },
    );
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
  });
});
