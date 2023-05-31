import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ResetPasswordDto {
  @Expose()
  @IsString()
  @ApiProperty()
  email: string;
}
