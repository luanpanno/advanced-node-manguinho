import axios from 'axios';

import { HttpGetClient } from './client';

export class AxiosHttpClient {
  async get<T = unknown>(args: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(args.url, { params: args.params });

    return result.data;
  }
}
