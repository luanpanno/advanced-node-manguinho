import { FacebookLoginController } from '@/application/controllers/facebook-login';

import { makeFacebookAuthenticationService } from '../services/facebook-authentication';

export const makeFacebookLoginController = (): FacebookLoginController =>
  new FacebookLoginController(makeFacebookAuthenticationService());
