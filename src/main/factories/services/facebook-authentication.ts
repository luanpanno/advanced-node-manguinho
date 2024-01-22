import { FacebookAuthenticationService } from '@/domain/services';

import { makeFacebookApi } from '../apis/facebook';
import { makeJwtTokenGenerator } from '../crypto/jwt-token-generator';
import { makePgUserAccountRepo } from '../repos/pg-user-account';

export const makeFacebookAuthenticationService =
  (): FacebookAuthenticationService =>
    new FacebookAuthenticationService(
      makeFacebookApi(),
      makePgUserAccountRepo(),
      makeJwtTokenGenerator(),
    );
