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
      min: 10000,
      max: 19999,
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
    this.logger.verbose(otp);
    return code;
  }

  async verifyOtp(id: string): Promise<boolean> {
    const otp = await this.databaseService.oTP.findUnique({ where: { id } });
    if (!otp) {
      return false;
    }
    if (otp.isExpired) {
      return false;
    } else {
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
