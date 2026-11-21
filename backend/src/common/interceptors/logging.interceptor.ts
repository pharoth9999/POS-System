import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { type Observable, tap } from 'rxjs';

/** Logs method, URL and duration of every successful request. */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const { method, originalUrl } = context.switchToHttp().getRequest<Request>();
    const startedAt = Date.now();
    return next
      .handle()
      .pipe(tap(() => this.logger.log(`${method} ${originalUrl} ${Date.now() - startedAt}ms`)));
  }
}
