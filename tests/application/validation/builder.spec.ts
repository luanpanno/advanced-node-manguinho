import { ValidationBuilder } from '@/application/validation/builder';
import { RequiredStringValidator } from '@/application/validation/required-string';

describe('ValidationBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder.of({
      value: 'any_value',
      fieldName: 'any_name',
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredStringValidator('any_value', 'any_name'),
    ]);
  });
});
