import { RequiredStringValidator } from './required-string';
import { Validator } from './validator';

type Value = string | undefined | null;

export class ValidationBuilder {
  private constructor(
    private readonly value: Value,
    private readonly fieldName: string,
    private readonly validators: Validator[] = [],
  ) {}

  static of(params: { value: Value; fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName);
  }

  required(): ValidationBuilder {
    this.validators.push(
      new RequiredStringValidator(this.value, this.fieldName),
    );

    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
