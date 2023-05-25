import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
