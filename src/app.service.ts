import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor(private mailerService: MailerService) {}
  /**
   * Retrieves a Promise that resolves to a Record<string, any> representing a message that indicates that an email has been sent.
   * Ensures that no line of code is over 66 characters.
   */
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

    // Log the sent email
    console.log(mail);

    // Return a message indicating that the email was sent
    return { message: 'Sent' };
  }
}
