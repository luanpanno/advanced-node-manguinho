import { FacebookApi } from '@/infra/apis/facebook';

import { env } from '@/main/config/env';

import { makeAxiosHttpClient } from '../http/axios-client';

export const makeFacebookApi = (): FacebookApi =>
  new FacebookApi(
    makeAxiosHttpClient(),
    env.facebookApi.clientId,
    env.facebookApi.clientSecret,
  );
