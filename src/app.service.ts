import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor(private mailerService: MailerService) {}
  async getHello(): Promise<Record<string, any>> {
    const mail = await this.mailerService.sendMail({
      from: 'support@vent.ly',
      to: 'danielemmanuel257@gmail.com',
      subject: 'Account creation',
      context: {
        email: 'dandolla@gmail.com',
        code: 2334,
      },
      template: join(process.cwd(), 'templates', 'welcome.hbs'),
    });
    console.log(mail);
    return { message: 'Sent' };
  }
}
