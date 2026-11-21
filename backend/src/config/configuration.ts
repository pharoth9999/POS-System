/**
 * Typed, namespaced view of the environment. Read it with
 * `configService.get('db', { infer: true })` etc.
 */
export interface AppConfig {
  nodeEnv: string;
  port: number;
  /** Exact origins allowed by CORS, from comma-separated CORS_ORIGIN. */
  corsOrigins: string[];
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  telegram: {
    botToken: string;
    chatId: string;
  };
}

export const parseOrigins = (value: string): string[] =>
  value
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN!),
  db: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    chatId: process.env.TELEGRAM_CHAT_ID ?? '',
  },
});
