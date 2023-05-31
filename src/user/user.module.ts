import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailModule } from '@app/email';
import { OtpModule } from 'libs/OTP/src';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [EmailModule, OtpModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
