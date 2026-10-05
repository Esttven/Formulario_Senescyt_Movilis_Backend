import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { join } from 'path';
import express from 'express';
import { AppModule } from './app.module';
import { JsonExceptionFilter } from './common/filters/json-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const logger = app.get(Logger);
  const port = Number(config.get('PORT', 3008));
  const configuredCorsOrigins = config.get<string>('CORS_ORIGINS');
  const corsOrigins = (configuredCorsOrigins ?? 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (
    config.get<string>('NODE_ENV') === 'production' &&
    (!configuredCorsOrigins || !corsOrigins.length || corsOrigins.includes('*'))
  ) {
    throw new Error('Production CORS_ORIGINS must list allowed origins explicitly.');
  }

  app.useLogger(logger);
  app.use(helmet());
  app.use(
    '/uploads',
    express.static(join(process.cwd(), config.get<string>('STORAGE_ROOT', 'storage'))),
  );
  app.enableCors({ origin: corsOrigins, credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new JsonExceptionFilter());

  const swaggerEnabled =
    config.get<string>(
      'SWAGGER_ENABLED',
      config.get<string>('NODE_ENV') === 'production' ? 'false' : 'true',
    ) === 'true';
  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Forms Senescyt API')
      .setDescription('REST API for the Forms Senescyt application')
      .setVersion('0.1.0')
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, swaggerDocument);
  }

  await app.listen(port);
  logger.log(`Backend listening on http://localhost:${port}/api`, 'Bootstrap');
}

void bootstrap();
