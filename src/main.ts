import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require('morgan');
require('source-map-support/register');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny'));
  app.enableCors();
  const configSerrvice = app.get<ConfigService>(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Vently API')
    .setDescription('The Vently API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configSerrvice.get('PORT'));
}
bootstrap();
