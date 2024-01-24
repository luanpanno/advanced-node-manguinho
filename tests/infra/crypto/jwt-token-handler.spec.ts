import jwt from 'jsonwebtoken';

import { JwtTokenHandler } from '@/infra/crypto/jwt-token-handler';

jest.mock('jsonwebtoken');

const makeSut = () => {
  const fakeJwt = jwt as jest.Mocked<typeof jwt>;
  fakeJwt.sign.mockImplementation(() => 'any_token');
  const sut = new JwtTokenHandler('any_secret');

  return {
    sut,
    fakeJwt,
  };
};

describe('JwtTokenHandler', () => {
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

  it('should return a token', async () => {
    const { sut } = makeSut();
    const token = await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000,
    });

    expect(token).toBe('any_token');
  });

  it('should rethrow if sign throws', async () => {
    const { sut, fakeJwt } = makeSut();

    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_error');
    });

    const promise = sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000,
    });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
