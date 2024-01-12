import { mock } from 'jest-mock-extended';

import { FacebookAuthentication } from '@/domain/features';

type HttpResponse = {
  statusCode: number;
  data: unknown;
};

class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(httpRequest: any): Promise<HttpResponse> {
    this.facebookAuth.perform({ token: httpRequest.token });
    return {
      statusCode: 400,
      data: new Error('The field token is required'),
    };
  }
}

const makeSut = () => {
  const facebookAuth = mock<FacebookAuthentication>();
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
});
