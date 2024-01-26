import { JwtTokenHandler } from '@/infra/crypto/jwt-token-handler';

import { env } from '@/main/config/env';

export const makeJwtTokenHandler = (): JwtTokenHandler =>
  new JwtTokenHandler(env.jwtSecret);
