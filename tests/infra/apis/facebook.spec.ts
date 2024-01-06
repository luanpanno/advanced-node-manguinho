import { mock } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>;
}

namespace HttpGetClient {
  export type Params = {
    url: string;
    params: object;
  };
}

const makeSut = () => {
  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';
  const httpClient = mock<HttpGetClient>();
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
});
