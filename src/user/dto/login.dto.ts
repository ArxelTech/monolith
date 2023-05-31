import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

@Exclude()
export class loginDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty()
  @IsString()
  password: string;
}
