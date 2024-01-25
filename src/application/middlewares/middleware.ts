import { HttpResponse } from '@/application/helpers/http';

export interface Middleware {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle: (httpRequest: any) => Promise<HttpResponse<any>>;
}
