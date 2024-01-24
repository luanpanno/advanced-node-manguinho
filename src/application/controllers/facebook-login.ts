import { HttpResponse, ok, unauthorized } from '@/application/helpers/http';

import { FacebookAuthentication } from '@/domain/use-cases';

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
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuthentication({
        token: token!,
      });

      return ok(accessToken);
    } catch {
      return unauthorized();
    }
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
