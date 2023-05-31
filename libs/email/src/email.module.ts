import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OtpModule } from 'libs/OTP/src';

@Module({
  imports: [OtpModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
