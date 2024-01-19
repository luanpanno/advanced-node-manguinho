import { RequestHandler } from 'express';

import { Controller } from '@/application/controllers/controller';
import { HttpResponse } from '@/application/helpers/http';

export const adaptExpressRoute =
  (controller: Controller): RequestHandler =>
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpResponse: HttpResponse<any> = await controller.handle(req.body);

    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.data);
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.data.message });
    }
  };
