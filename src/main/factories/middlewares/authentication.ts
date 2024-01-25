import { AuthenticationMiddleware } from '@/application/middlewares/authentication';

import { setupAuthorize } from '@/domain/use-cases/authorize';

import { makeJwtTokenHandler } from '../crypto/jwt-token-handler';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwtTokenHandler = makeJwtTokenHandler();
  const authorize = setupAuthorize(jwtTokenHandler);

  return new AuthenticationMiddleware(authorize);
};
