import { ServerError } from '@/application/errors/server';
import { HttpResponse } from '@/application/helpers/http';

import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

export class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
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
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error),
      };
    }
  }
}
