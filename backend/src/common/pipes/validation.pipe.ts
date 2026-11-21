import { ValidationPipe } from '@nestjs/common';

/**
 * Global validation:
 * - whitelist: strip properties without validation decorators
 * - forbidNonWhitelisted: reject requests that send unknown properties
 * - transform: turn payloads into DTO instances and cast query/path params
 */
export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });
