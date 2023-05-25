import { Module } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
})
export class AuthModule {}
