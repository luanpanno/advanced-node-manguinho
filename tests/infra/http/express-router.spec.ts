import { getMockReq, getMockRes } from '@jest-mock/express';
import { Request, Response } from 'express';
import { mock } from 'jest-mock-extended';

import { Controller } from '@/application/controllers/controller';

class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async adapt(req: Request, res: Response): Promise<void> {
    await this.controller.handle(req.body);
  }
}

const makeSut = () => {
  const req = getMockReq({ body: { any: 'any' } });
  const { res } = getMockRes();
  const controller = mock<Controller>();
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
  });

  it('should call handle with empty request', async () => {
    const { sut, res, controller } = makeSut();
    const req = getMockReq({ body: undefined });

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({});
  });
});
