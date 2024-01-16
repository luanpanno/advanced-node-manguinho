import { RequiredFieldError } from '@/application/errors/http';

class RequiredStringValidator {
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

describe('RequiredStringValidator', () => {
  it('should return RequiredStringValidator if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('should return RequiredStringValidator if value is null', () => {
    const sut = new RequiredStringValidator(null, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('should return RequiredStringValidator if value is undefined', () => {
    const sut = new RequiredStringValidator(null, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('should return undefined if value exists', () => {
    const sut = new RequiredStringValidator('any_value', 'any_field');

    const error = sut.validate();

    expect(error).toBe(undefined);
  });
});
