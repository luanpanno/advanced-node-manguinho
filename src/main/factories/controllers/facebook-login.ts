import { FacebookLoginController } from '@/application/controllers/facebook-login';

import { makeFacebookAuthentication } from '../use-cases/facebook-authentication';

export const makeFacebookLoginController = (): FacebookLoginController =>
  new FacebookLoginController(makeFacebookAuthentication());
