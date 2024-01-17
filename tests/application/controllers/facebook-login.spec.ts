import { mock } from 'jest-mock-extended';

import { FacebookLoginController } from '@/application/controllers/facebook-login';
import { UnauthorizedError } from '@/application/errors/http';
import { RequiredStringValidator } from '@/application/validation/required-string';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

const makeSut = () => {
  const facebookAuth = mock<FacebookAuthentication>();
  facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  const sut = new FacebookLoginController(facebookAuth);

  return {
    sut,
    facebookAuth,
  };
};

describe('FacebookLoginController', () => {
  it('should build validators correctly', () => {
    const { sut } = makeSut();
    const validators = sut.buildValidators({ token: 'any_token' });

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token'),
    ]);
  });

  it('should call FacebookAuthentication with correct params', async () => {
    const { sut, facebookAuth } = makeSut();

    await sut.handle({ token: 'any_token' });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if authentication fails', async () => {
    const { sut, facebookAuth } = makeSut();

    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());

    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should return 200 if authentication succeeds', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value',
      },
    });
  });
});
