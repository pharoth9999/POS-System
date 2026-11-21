import Joi from 'joi';
import { parseOrigins } from './configuration.js';

/** scheme://host[:port], nothing after it. */
const ORIGIN_PATTERN = /^https?:\/\/[^\s/?#*]+$/;

/**
 * Validates process.env at startup. The app refuses to boot if a required
 * variable is missing or malformed, so misconfiguration fails fast.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  // Comma-separated exact origins, e.g. "http://localhost:5173,https://pos.example.com".
  // Required, and "*" is rejected: every allowed frontend must be listed.
  CORS_ORIGIN: Joi.string()
    .required()
    .custom((value: string, helpers) => {
      const origins = parseOrigins(value);
      const invalid = origins.filter((origin) => !ORIGIN_PATTERN.test(origin));
      if (origins.length === 0 || invalid.length > 0) {
        return helpers.message({
          custom: `must be comma-separated origins like http://localhost:5173 (wildcards and paths are not allowed); invalid: ${invalid.join(', ') || '(empty)'}`,
        });
      }
      return value;
    }),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  TELEGRAM_BOT_TOKEN: Joi.string().allow('').default(''),
  TELEGRAM_CHAT_ID: Joi.string().allow('').default(''),
});
