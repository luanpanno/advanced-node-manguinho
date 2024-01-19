import {
  HttpResponse,
  badRequest,
  serverError,
} from '@/application/helpers/http';

import { ValidationComposite } from '../validation/composite';
import { Validator } from '../validation/validator';

type HttpRequest = unknown;

export abstract class Controller {
  abstract perform(httpRequest: HttpRequest): Promise<HttpResponse>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  buildValidators(httpRequest: HttpRequest): Validator[] {
    return [];
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validate(httpRequest);

      if (error !== undefined) {
        return badRequest(error);
      }

      return await this.perform(httpRequest);
    } catch (error) {
      return serverError(error);
    }
  }

  private validate(httpRequest: HttpRequest): Error | undefined {
    const validators = this.buildValidators(httpRequest);
    const validator = new ValidationComposite(validators);

    return validator.validate();
  }
}
