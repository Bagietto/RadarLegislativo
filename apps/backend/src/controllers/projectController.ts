import type { Request, Response } from 'express';
import { projectService } from '../services/projectService.js';

export const projectController = {
  async search(req: Request, res: Response): Promise<void> {
    const query = String(req.query.query ?? '');
    const projects = await projectService.searchProjects(query);
    res.json({ data: projects });
  },

  async detail(req: Request, res: Response): Promise<void> {
    const externalId = req.params.externalId;
    const payload = await projectService.getProjectDetailAndPersist(externalId);
    res.json(payload);
  },
};
