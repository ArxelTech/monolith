import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { InterestInterface } from '@app/database';

@Exclude()
export class ReadInterestDTO implements InterestInterface {
  @Expose()
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  interest: string;
}
