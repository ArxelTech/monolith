import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsEmail, IsNumber } from 'class-validator';

@Exclude()
export class VerifyEmailDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty()
  @IsNumber()
  otp: number;
}
