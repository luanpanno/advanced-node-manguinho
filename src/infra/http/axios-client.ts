import axios from 'axios';

import { HttpGetClient } from './client';

export class AxiosHttpClient implements HttpGetClient {
  async get<T = unknown>({ url, params }: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(url, { params });

    return result.data;
  }
}
