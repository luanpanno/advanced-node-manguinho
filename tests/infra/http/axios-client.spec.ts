import axios from 'axios';

import { HttpGetClient } from '@/infra/http/client';

class AxiosHttpClient {
  async get(args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, { params: args.params });
  }
}

jest.mock('axios');

const makeSut = () => {
  const fakeAxios = axios as jest.Mocked<typeof axios>;
  const sut = new AxiosHttpClient();

  return {
    fakeAxios,
    sut,
  };
};

describe('AxiosHttpClient', () => {
  describe('get', () => {
    it('should call get with correct params', async () => {
      const { sut, fakeAxios } = makeSut();
      const url = 'any_url';
      const params = {
        any: 'any',
      };

      await sut.get({
        url,
        params,
      });

      expect(fakeAxios.get).toHaveBeenCalledWith(url, {
        params,
      });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
