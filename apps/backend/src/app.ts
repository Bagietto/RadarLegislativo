import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { runMigrations } from './db/migrate.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { deputyRoutes } from './routes/deputyRoutes.js';
import { projectRoutes } from './routes/projectRoutes.js';

runMigrations();

export const app = express();

app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api/projects', projectRoutes);
app.use('/api/deputies', deputyRoutes);

app.use(errorHandler);
