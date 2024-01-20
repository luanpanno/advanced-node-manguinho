import { RequestHandler } from 'express';

import { Controller } from '@/application/controllers/controller';
import { HttpResponse } from '@/application/helpers/http';

export const adaptExpressRoute =
  (controller: Controller): RequestHandler =>
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { statusCode, data }: HttpResponse<any> = await controller.handle(
      req.body,
    );
    const json = statusCode === 200 ? data : { error: data.message };

    res.status(statusCode).json(json);
  };
