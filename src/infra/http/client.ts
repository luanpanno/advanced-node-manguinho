export interface HttpGetClient {
  get: <T = unknown>(params: HttpGetClient.Params) => Promise<T>;
}

export namespace HttpGetClient {
  export type Params = {
    url: string;
    params: object;
  };
}
