import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

@Exclude()
export class ResendEmailVerificationDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
