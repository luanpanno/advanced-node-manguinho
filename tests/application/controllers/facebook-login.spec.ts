import { FacebookLoginController } from '@/application/controllers/facebook-login';
import { UnauthorizedError } from '@/application/errors/http';
import { RequiredStringValidator } from '@/application/validation/required-string';

import { AuthenticationError } from '@/domain/entities/errors';

const makeSut = () => {
  const facebookAuth = jest.fn();
  facebookAuth.mockResolvedValue({ accessToken: 'any_value' });
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

    expect(facebookAuth).toHaveBeenCalledWith({ token: 'any_token' });
    expect(facebookAuth).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if authentication fails', async () => {
    const { sut, facebookAuth } = makeSut();

    facebookAuth.mockRejectedValueOnce(new AuthenticationError());

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
