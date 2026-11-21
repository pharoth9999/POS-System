import { ValidateIf } from 'class-validator';

/**
 * "May be left out, but not null." Use it instead of @IsOptional(), which
 * skips every rule for null as well, so `{ "fullName": null }` would reach
 * the database and fail with a 500. With this, null is validated and
 * rejected with a 400 by the field's other rules.
 *
 * Do not use PartialType() on DTOs that need this: it adds @IsOptional().
 */
export const Optional = () =>
  ValidateIf((_object: object, value: unknown) => value !== undefined);
