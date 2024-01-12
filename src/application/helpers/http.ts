export type HttpResponse = {
  statusCode: number;
  data: unknown;
};

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  data: error,
});
