import { Router } from 'express';
import { z } from 'zod';
import { deputyController } from '../controllers/deputyController.js';
import { validateQuery } from '../middlewares/validate.js';

const searchQuerySchema = z.object({
  query: z.string().optional(),
});

export const deputyRoutes = Router();

deputyRoutes.get('/', validateQuery(searchQuerySchema), deputyController.search);
deputyRoutes.get('/:externalId/votes', deputyController.history);
