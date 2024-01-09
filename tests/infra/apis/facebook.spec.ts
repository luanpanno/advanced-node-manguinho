import { mock } from 'jest-mock-extended';

import { FacebookApi } from '@/infra/apis/facebook';
import { HttpGetClient } from '@/infra/http/client';

const makeSut = () => {
  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';
  const httpClient = mock<HttpGetClient>();
  httpClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' });
  const sut = new FacebookApi(httpClient, clientId, clientSecret);

  return {
    clientId,
    clientSecret,
    httpClient,
    sut,
  };
};

describe('Facebook', () => {
  it('should get app token', async () => {
    const { sut, httpClient, clientId, clientSecret } = makeSut();

    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
  });

  it('should get debug token', async () => {
    const { sut, httpClient } = makeSut();

    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token',
      },
    });
  });
});
