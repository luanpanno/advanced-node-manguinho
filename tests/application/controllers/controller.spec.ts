import { Controller } from '@/application/controllers/controller';
import { ServerError } from '@/application/errors/http';
import { HttpResponse } from '@/application/helpers/http';
import { ValidationComposite } from '@/application/validation/composite';

jest.mock('@/application/validation/composite');

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data',
  };

  async perform(): Promise<HttpResponse> {
    return this.result;
  }
}

describe('Controller', () => {
  let sut: ControllerStub;

  beforeEach(() => {
    sut = new ControllerStub();
  });

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error');

    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));

    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy);

    const httpResponse = await sut.handle('any_value');

    expect(ValidationComposite).toHaveBeenCalledWith([]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
  });

  it('should return 500 if perform throws', async () => {
    const error = new Error('perform_error');

    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error);

    const httpResponse = await sut.handle('any_value');

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });

  it('should return same result from perform', async () => {
    const httpResponse = await sut.handle('any_value');

    expect(httpResponse).toEqual(sut.result);
  });
});
