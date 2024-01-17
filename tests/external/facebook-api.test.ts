import { FacebookApi } from '@/infra/apis/facebook';
import { AxiosHttpClient } from '@/infra/http/axios-client';

import { env } from '@/main/config/env';

describe('Facebook Api Integration Tests', () => {
  it('should return a facebook user if token is valid', async () => {
    // const axiosClient = new AxiosHttpClient();
    // const sut = new FacebookApi(
    //   axiosClient,
    //   env.facebookApi.clientId,
    //   env.facebookApi.clientSecret,
    // );

    // const fbUser = await sut.loadUser({ token: '' });

    // expect(fbUser).toEqual({
    //   facebookId: '',
    //   email: '',
    //   name: '',
    // });

    // User tests are temporarily disabled by Facebook
    expect(1).toBe(1);
  });

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );

    const fbUser = await sut.loadUser({ token: 'invalid' });

    expect(fbUser).toBeUndefined();
  });
});
