import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configSerrvice = app.get<ConfigService>(ConfigService);
  await app.listen(configSerrvice.get('PORT'));
}
bootstrap();
