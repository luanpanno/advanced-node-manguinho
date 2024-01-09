export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<HttpGetClient.Result>;
}

export namespace HttpGetClient {
  export type Params = {
    url: string;
    params: object;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Result = any;
}
