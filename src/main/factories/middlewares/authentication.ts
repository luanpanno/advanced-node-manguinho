import { AuthenticationMiddleware } from '@/application/middlewares/authentication';

import { makeJwtTokenHandler } from '../gateways/jwt-token';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwtTokenHandler = makeJwtTokenHandler();

  return new AuthenticationMiddleware(
    jwtTokenHandler.validate.bind(jwtTokenHandler),
  );
};
