import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock } from 'jest-mock-extended';

import { Controller } from '@/application/controllers/controller';

import { adaptExpressRoute } from '@/main/adapters/express-router';

const makeSut = () => {
  const req = getMockReq({ body: { any: 'any' } });
  const { res, next } = getMockRes();
  const controller = mock<Controller>();
  controller.handle.mockResolvedValue({
    statusCode: 200,
    data: {
      data: 'any_data',
    },
  });
  const sut = adaptExpressRoute(controller);

  return {
    req,
    res,
    next,
    controller,
    sut,
  };
};

describe('ExpressRouter', () => {
  it('should call handle with correct request', async () => {
    const { sut, req, res, next, controller } = makeSut();

    await sut(req, res, next);

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    const { sut, res, next, controller } = makeSut();
    const req = getMockReq({ body: undefined });

    await sut(req, res, next);

    expect(controller.handle).toHaveBeenCalledWith({});
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond with 200 and valid data', async () => {
    const { sut, req, next, res } = makeSut();

    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should respond with 400 and valid error', async () => {
    const { sut, req, res, next, controller } = makeSut();

    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error'),
    });

    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should respond with 500 and valid error', async () => {
    const { sut, req, res, next, controller } = makeSut();

    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error'),
    });

    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
