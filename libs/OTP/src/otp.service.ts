import { DatabaseService } from '@app/database';
import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomNumber = require('random-number');
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { OTP, OTPENUM } from '@prisma/client';

@Injectable()
export class OtpService {
  private logger = new Logger(OtpService.name);
  constructor(private databaseService: DatabaseService) {}

  private generateNumber(): number {
    const options = {
      min: 100000,
      max: 199999,
      integer: true,
    };
    const code = randomNumber(options);
    return code;
  }

  async generateOtp({
    isUser,
    type,
    userId,
  }: {
    isUser: boolean;
    type: OTPENUM;
    userId?: string;
  }): Promise<number> {
    const code = this.generateNumber();
    const otp: OTP = await this.databaseService.oTP.create({
      data: {
        code,
        isExpired: false,
        isForUser: isUser ? true : false,
        type,
        userId,
      },
    });
    const timeout = setTimeout(() => {
      this.markAsExpired(otp.id);
      clearTimeout(timeout);
    }, 5 * 60000);
    this.logger.verbose(otp);
    return code;
  }

  async verifyEmailOtp(code: number, userId: string): Promise<boolean> {
    const otp = await this.databaseService.oTP.findFirst({
      where: {
        AND: [{ userId }, { code }, { type: 'AUTH' }],
      },
    });
    if (!otp) {
      return false;
    }
    if (otp.isExpired) {
      return false;
    } else {
      await this.databaseService.oTP.update({
        where: { id: otp.id },
        data: { isExpired: true },
      });
      return true;
    }
  }

  async markAsExpired(id: string) {
    const otp = await this.databaseService.oTP.update({
      where: { id },
      data: { isExpired: true },
    });
    this.logger.verbose(otp);
  }
}
