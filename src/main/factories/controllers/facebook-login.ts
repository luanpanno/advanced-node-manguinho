import { FacebookLoginController } from '@/application/controllers/facebook-login';

import { makeFacebookAuthenticationUseCase } from '../use-cases/facebook-authentication';

export const makeFacebookLoginController = (): FacebookLoginController =>
  new FacebookLoginController(makeFacebookAuthenticationUseCase());
