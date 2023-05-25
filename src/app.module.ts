import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { InterestsModule } from './interests/interests.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { helpers } from 'handlebars';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
// import * as handlebars from 'handlebars';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    CacheModule.register(),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtps://${process.env.SMTP_USERNAME}:${process.env.SMTP_PASSWORD}@${process.env.SMTP_DOMAIN}`,
        defaults: {
          from: '"Vently Support" <support@vent.ly>',
        },
        template: {
          dir: join(process.cwd(), '/templates'),
          adapter: new HandlebarsAdapter(helpers, {
            inlineCssEnabled: true,
            /** See https://www.npmjs.com/package/inline-css#api */
            inlineCssOptions: {
              url: ' ',
              preserveMediaQueries: true,
            },
          }),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ServicesModule,
    InterestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
