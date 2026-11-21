import { ClassSerializerInterceptor, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { createValidationPipe } from './common/pipes/validation.pipe.js';
import type { AppConfig } from './config/configuration.js';

/**
 * Everything the app needs at the HTTP layer. Called by main.ts AND by the
 * e2e tests, so tests run with the same prefix, CORS, validation, error
 * format and serialization as production. Add new global setup here, not in
 * main.ts.
 */
export function configureApp(app: INestApplication): INestApplication {
  const config = app.get<ConfigService<AppConfig, true>>(ConfigService);

  // Security headers (CSP, HSTS, X-Content-Type-Options, frameguard, ...).
  // Defaults are fine for a JSON API, and Swagger UI loads its scripts from
  // files, so it works under the default CSP too.
  app.use(helmet());

  app.setGlobalPrefix('api');
  app.enableCors({ origin: config.get('corsOrigins', { infer: true }) });
  app.enableShutdownHooks();

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    // Applies @Exclude() on entities, e.g. User.passwordHash.
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  return app;
}
