import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  if (existsSync('.env')) process.loadEnvFile('.env');
  const { AppModule } = await import('./app.module.js');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(','),
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
