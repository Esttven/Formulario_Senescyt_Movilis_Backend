import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './health/health.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        redact: ['req.headers.authorization', 'req.headers.cookie'],
      },
    }),
    PrismaModule,
    HealthModule,
    CatalogosModule,
    EstudiantesModule,
  ],
})
export class AppModule {}
