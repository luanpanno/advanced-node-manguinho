import { UnauthorizedError } from '../errors/http';

export type HttpResponse = {
  statusCode: number;
  data: unknown;
};

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  data: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  data: new UnauthorizedError(),
});
