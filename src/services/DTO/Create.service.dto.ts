import { ServiceCreateable } from '@app/database';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateServiceDTO implements Partial<ServiceCreateable> {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  service: string;
}
