import type { Request, Response } from 'express';
import { deputyService } from '../services/deputyService.js';

export const deputyController = {
  search(req: Request, res: Response): void {
    const query = String(req.query.query ?? '');
    const deputies = deputyService.searchDeputies(query);
    res.json({ data: deputies });
  },

  history(req: Request, res: Response): void {
    const payload = deputyService.getDeputyHistory(req.params.externalId);
    res.json(payload);
  },
};
