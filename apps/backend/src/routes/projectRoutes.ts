import { Router } from 'express';
import { z } from 'zod';
import { projectController } from '../controllers/projectController.js';
import { validateQuery } from '../middlewares/validate.js';

const searchQuerySchema = z.object({
  query: z.string().optional(),
});

export const projectRoutes = Router();

projectRoutes.get('/search', validateQuery(searchQuerySchema), projectController.search);
projectRoutes.get('/:externalId', projectController.detail);
