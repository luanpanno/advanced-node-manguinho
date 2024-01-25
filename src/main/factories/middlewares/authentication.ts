import { AuthenticationMiddleware } from '@/application/middlewares/authentication';

import { makeJwtTokenHandler } from '../crypto/jwt-token-handler';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwtTokenHandler = makeJwtTokenHandler();

  return new AuthenticationMiddleware(
    jwtTokenHandler.validateToken.bind(jwtTokenHandler),
  );
};
