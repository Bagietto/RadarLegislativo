import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: toNumber(process.env.PORT, 3000),
  dbPath: process.env.DB_PATH ?? './apps/backend/data/database.sqlite',
  camaraApiBaseUrl: process.env.CAMARA_API_BASE_URL ?? 'https://dadosabertos.camara.leg.br/api/v2',
  requestTimeoutMs: toNumber(process.env.REQUEST_TIMEOUT_MS, 10000),
  cacheTtlMs: toNumber(process.env.CACHE_TTL_MS, 300000),
};
