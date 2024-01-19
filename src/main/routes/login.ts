import { Router } from 'express';

import { adaptExpressRoute } from '@/infra/http/express-router';

import { makeFacebookLoginController } from '../factories/controllers/facebook-login';

export default (router: Router): void => {
  const controller = makeFacebookLoginController();
  const adapter = adaptExpressRoute(controller);

  router.post('/api/login/facebook', adapter);
};
