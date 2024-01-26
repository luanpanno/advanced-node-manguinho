import {
  FacebookAuthentication,
  setupFacebookAuthentication,
} from '@/domain/use-cases';

import { makeFacebookApi } from '../gateways/facebook';
import { makeJwtTokenHandler } from '../gateways/jwt-token';
import { makePgUserAccountRepo } from '../repos/pg-user-account';

export const makeFacebookAuthentication = (): FacebookAuthentication =>
  setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenHandler(),
  );
