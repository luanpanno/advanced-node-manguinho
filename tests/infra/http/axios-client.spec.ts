import axios from 'axios';

import { HttpGetClient } from '@/infra/http/client';

class AxiosHttpClient {
  async get<T = unknown>(args: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(args.url, { params: args.params });

    return result.data;
  }
}

jest.mock('axios');

const makeSut = () => {
  const fakeAxios = axios as jest.Mocked<typeof axios>;
  fakeAxios.get.mockResolvedValue({ status: 200, data: 'any_data' });
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

    it('should return data on success', async () => {
      const { sut } = makeSut();
      const url = 'any_url';
      const params = {
        any: 'any',
      };

      const result = await sut.get({
        url,
        params,
      });

      expect(result).toEqual('any_data');
    });

    it('should rethrow if get throws', async () => {
      const { sut, fakeAxios } = makeSut();
      const url = 'any_url';
      const params = {
        any: 'any',
      };

      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'));

      const promise = sut.get({
        url,
        params,
      });

      expect(promise).rejects.toThrow(new Error('http_error'));
    });
  });
});
