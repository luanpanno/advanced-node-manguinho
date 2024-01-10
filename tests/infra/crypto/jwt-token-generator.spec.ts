import jwt from 'jsonwebtoken';

import { TokenGenerator } from '@/data/contracts/crypto/token';

jest.mock('jsonwebtoken');

class JwtTokenGenerator {
  constructor(private readonly secret: string) {}

  generateToken(params: TokenGenerator.Params): TokenGenerator.Result {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });

    return token;
  }
}

const makeSut = () => {
  const fakeJwt = jwt as jest.Mocked<typeof jwt>;
  fakeJwt.sign.mockImplementation(() => 'any_token');
  const sut = new JwtTokenGenerator('any_secret');

  return {
    sut,
    fakeJwt,
  };
};

describe('JwtTokenGenerator', () => {
  it('should call sign with correct params', () => {
    const { sut, fakeJwt } = makeSut();

    sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

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

  it('should return a token', () => {
    const { sut } = makeSut();
    const token = sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000,
    });

    expect(token).toBe('any_token');
  });
});
