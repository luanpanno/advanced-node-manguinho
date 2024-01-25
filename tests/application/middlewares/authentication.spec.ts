import { ForbiddenError } from '@/application/errors/http';
import { HttpResponse, forbidden } from '@/application/helpers/http';

type HttpRequest = { authorization: string };

class AuthenticationMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    return forbidden();
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware;

  beforeEach(() => {
    sut = new AuthenticationMiddleware();
  });

  it('should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as never });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({
      authorization: undefined as never,
    });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });
});
