import { adaptExpressMiddleware } from '../adapters/express-middleware';
import { makeAuthenticationMiddleware } from '../factories/middlewares/authentication';

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware());
