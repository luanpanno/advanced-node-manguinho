import {
  FacebookAuthentication,
  setupFacebookAuthentication,
} from '@/domain/use-cases';

import { makeFacebookApi } from '../apis/facebook';
import { makeJwtTokenHandler } from '../crypto/jwt-token-handler';
import { makePgUserAccountRepo } from '../repos/pg-user-account';

export const makeFacebookAuthentication = (): FacebookAuthentication =>
  setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenHandler(),
  );
