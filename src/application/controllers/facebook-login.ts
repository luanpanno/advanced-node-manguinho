import { RequiredFieldError } from '@/application/errors/http';
import {
  HttpResponse,
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/application/helpers/http';

import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

type HttpRequest = {
  token: string | undefined | null;
};

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest);

      if (error !== undefined) {
        return badRequest(error);
      }

      const accessToken = await this.facebookAuth.perform({
        token: httpRequest.token!,
      });

      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value });
      }

      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }

  private validate(httpRequest: HttpRequest): Error | undefined {
    if (
      httpRequest.token === '' ||
      httpRequest.token === null ||
      httpRequest.token === undefined
    ) {
      return new RequiredFieldError('token');
    }
  }
}
