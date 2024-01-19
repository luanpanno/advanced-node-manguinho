import { Request, Response } from 'express';

import { Controller } from '@/application/controllers/controller';
import { HttpResponse } from '@/application/helpers/http';

export class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpResponse: HttpResponse<any> = await this.controller.handle(
      req.body,
    );

    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.data);
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.data.message });
    }
  }
}
