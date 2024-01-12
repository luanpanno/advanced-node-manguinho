import { RequiredFieldError, ServerError } from '@/application/errors/http';
import {
  HttpResponse,
  badRequest,
  unauthorized,
} from '@/application/helpers/http';

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
        return badRequest(new RequiredFieldError('token'));
      }

      const accessToken = await this.facebookAuth.perform({
        token: httpRequest.token,
      });

      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: accessToken.value,
          },
        };
      }

      return unauthorized();
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error),
      };
    }
  }
}
