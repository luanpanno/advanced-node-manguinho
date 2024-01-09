import { LoadFacebookUserApi } from '@/data/contracts/apis';

import { HttpGetClient } from '../http/client';

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    const data = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });

    await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: data.access_token,
        input_token: params.token,
      },
    });
  }
}
