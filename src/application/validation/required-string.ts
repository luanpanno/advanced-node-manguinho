import { RequiredFieldError } from '../errors/http';

export class RequiredStringValidator {
  constructor(
    private readonly value: string | null | undefined,
    private readonly fieldName: string,
  ) {}

  validate(): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
