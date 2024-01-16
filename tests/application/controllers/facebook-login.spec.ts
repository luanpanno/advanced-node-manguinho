import { mock } from 'jest-mock-extended';

import { FacebookLoginController } from '@/application/controllers/facebook-login';
import { ServerError, UnauthorizedError } from '@/application/errors/http';
import { RequiredStringValidator } from '@/application/validation/required-string';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

jest.mock('@/application/validation/required-string');

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
  it('should return 400 if validation fails', async () => {
    const { sut } = makeSut();
    const error = new Error('validation_error');

    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));

    jest
      .mocked(RequiredStringValidator)
      .mockImplementationOnce(RequiredStringValidatorSpy);

    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(RequiredStringValidator).toHaveBeenCalledWith('any_token', 'token');
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
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

  it('should return 500 if authentication throws', async () => {
    const { sut, facebookAuth } = makeSut();
    const error = new Error('infra_error');

    facebookAuth.perform.mockRejectedValueOnce(error);

    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
