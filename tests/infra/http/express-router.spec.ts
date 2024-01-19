import { getMockReq, getMockRes } from '@jest-mock/express';
import { Request, Response } from 'express';
import { mock } from 'jest-mock-extended';

import { Controller } from '@/application/controllers/controller';

class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle(req.body);

    res.status(200).json(httpResponse.data);
  }
}

const makeSut = () => {
  const req = getMockReq({ body: { any: 'any' } });
  const { res } = getMockRes();
  const controller = mock<Controller>();
  controller.handle.mockResolvedValue({
    statusCode: 200,
    data: {
      data: 'any_data',
    },
  });
  const sut = new ExpressRouter(controller);

  return {
    req,
    res,
    controller,
    sut,
  };
};

describe('ExpressRouter', () => {
  it('should call handle with correct request', async () => {
    const { sut, req, res, controller } = makeSut();

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    const { sut, res, controller } = makeSut();
    const req = getMockReq({ body: undefined });

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({});
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond with 200 and valid data', async () => {
    const { sut, req, res } = makeSut();

    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
