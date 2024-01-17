import {
  HttpResponse,
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/application/helpers/http';

import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

import { ValidationBuilder } from '../validation/builder';
import { ValidationComposite } from '../validation/composite';

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
    const validators = ValidationBuilder.of({
      value: httpRequest.token,
      fieldName: 'token',
    })
      .required()
      .build();
    const validator = new ValidationComposite(validators);

    return validator.validate();
  }
}
