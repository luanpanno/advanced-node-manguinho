import { HttpResponse, ok, unauthorized } from '@/application/helpers/http';

import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

import { ValidationBuilder } from '../validation/builder';
import { Validator } from '../validation/validator';
import { Controller } from './controller';

type HttpRequest = {
  token: string | undefined | null;
};

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) {
    super();
  }

  async perform({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuth.perform({
      token: token!,
    });

    if (accessToken instanceof AccessToken) {
      return ok({ accessToken: accessToken.value });
    }

    return unauthorized();
  }

  override buildValidators({ token }: HttpRequest): Validator[] {
    return ValidationBuilder.of({
      value: token,
      fieldName: 'token',
    })
      .required()
      .build();
  }
}
