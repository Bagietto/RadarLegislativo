import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        error: 'Parametros invalidos',
        details: result.error.issues,
      });
      return;
    }
    req.query = result.data as Request['query'];
    next();
  };
