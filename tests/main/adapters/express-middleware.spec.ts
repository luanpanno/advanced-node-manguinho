import { getMockReq, getMockRes } from '@jest-mock/express';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { MockProxy, mock } from 'jest-mock-extended';

import { HttpResponse } from '@/application/helpers/http';

type Adapter = (middleware: Middleware) => RequestHandler;

const adaptExpressMiddleware: Adapter = (middleware) => async (req, res) => {
  const { statusCode, data } = await middleware.handle(req.headers);

  res.status(statusCode).json(data);
};

interface Middleware {
  handle: (httpRequest: unknown) => Promise<HttpResponse>;
}

describe('ExpressMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let middleware: MockProxy<Middleware>;
  let sut: RequestHandler;

  beforeEach(() => {
    req = getMockReq({ headers: { any: 'any' } });
    res = getMockRes().res;
    next = getMockRes().next;
    middleware = mock<Middleware>();
    middleware.handle.mockResolvedValue({
      statusCode: 500,
      data: { error: 'any_error' },
    });
  });

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware);
  });

  it('should call handle with correct request', async () => {
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    req = getMockReq();

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond with correct error and statusCode', async () => {
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
