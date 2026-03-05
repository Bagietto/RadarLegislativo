import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  void next;
  const message = error instanceof Error ? error.message : 'Erro interno';
  logger.error('Unhandled error', { message });
  res.status(500).json({ error: message });
};
