import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { AppConfig } from '../config/configuration.js';
import { buildTypeOrmOptions } from './typeorm.options.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>): TypeOrmModuleOptions => ({
        ...buildTypeOrmOptions(config.get('db', { infer: true })),
        // The app registers entities through TypeOrmModule.forFeature() instead
        // of the dist/ glob, so it also works when run from src/ (Vitest e2e).
        // Every entity must therefore be in some module's forFeature().
        entities: [],
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
