import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import type { AppConfig } from './config/configuration.js';

async function bootstrap() {
  const app = configureApp(await NestFactory.create(AppModule));
  const config = app.get<ConfigService<AppConfig, true>>(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('POS System API')
    .setVersion('0.1.0')
    .build();
  SwaggerModule.setup('api/docs', app, () => SwaggerModule.createDocument(app, swaggerConfig));

  const port = config.get('port', { infer: true });
  await app.listen(port);
  Logger.log(`API ready at http://localhost:${port}/api (docs: /api/docs)`, 'Bootstrap');
}
await bootstrap();
