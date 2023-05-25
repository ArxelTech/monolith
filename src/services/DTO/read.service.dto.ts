import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ServiceInterface } from '@app/database';

@Exclude()
export class ReadServiceDTO implements ServiceInterface {
  @Expose()
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  service: string;
}
