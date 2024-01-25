import { HttpResponse } from '@/application/helpers/http';

export interface Middleware {
  handle: (httpRequest: unknown) => Promise<HttpResponse>;
}
