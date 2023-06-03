import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateUserDto implements Partial<User> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
