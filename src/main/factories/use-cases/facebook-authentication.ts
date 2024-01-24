import {
  FacebookAuthentication,
  setupFacebookAuthentication,
} from '@/domain/use-cases';

import { makeFacebookApi } from '../apis/facebook';
import { makeJwtTokenGenerator } from '../crypto/jwt-token-generator';
import { makePgUserAccountRepo } from '../repos/pg-user-account';

export const makeFacebookAuthentication = (): FacebookAuthentication =>
  setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator(),
  );
