import { getMockReq, getMockRes } from '@jest-mock/express';
import { RequestHandler } from 'express';
import { mock } from 'jest-mock-extended';

import { HttpResponse } from '@/application/helpers/http';

type Adapter = (middleware: Middleware) => RequestHandler;

const adaptExpressMiddleware: Adapter =
  (middleware) => async (req, res, next) => {
    await middleware.handle(req.headers);
    next();
  };

interface Middleware {
  handle: (httpRequest: unknown) => Promise<HttpResponse>;
}

describe('ExpressMiddleware', () => {
  it('should call handle with correct request', async () => {
    const req = getMockReq({ headers: { any: 'any' } });
    const { res, next } = getMockRes();
    const middleware = mock<Middleware>();
    const sut = adaptExpressMiddleware(middleware);

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenLastCalledWith({ any: 'any' });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    const req = getMockReq();
    const { res, next } = getMockRes();
    const middleware = mock<Middleware>();
    const sut = adaptExpressMiddleware(middleware);

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenLastCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });
});
