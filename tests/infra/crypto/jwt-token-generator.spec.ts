import jwt from 'jsonwebtoken';

import { JwtTokenGenerator } from '@/infra/crypto/jwt-token-generator';

jest.mock('jsonwebtoken');

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
