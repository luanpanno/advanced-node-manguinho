import { mock } from 'jest-mock-extended';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

type HttpResponse = {
  statusCode: number;
  data: unknown;
};

class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(httpRequest: any): Promise<HttpResponse> {
    if (
      httpRequest.token === '' ||
      httpRequest.token === null ||
      httpRequest.token === undefined
    ) {
      return {
        statusCode: 400,
        data: new Error('The field token is required'),
      };
    }

    const result = await this.facebookAuth.perform({
      token: httpRequest.token,
    });

    if (result instanceof AccessToken) {
      return {
        statusCode: 200,
        data: {
          accessToken: result.value,
        },
      };
    }

    return {
      statusCode: 401,
      data: result,
    };
  }
}

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
  it('should return 400 if token is empty', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is null', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is undefined', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
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
      data: new AuthenticationError(),
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