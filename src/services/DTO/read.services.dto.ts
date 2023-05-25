import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ReadServiceDTO } from './read.service.dto';

@Exclude()
export class ReadServicesDTO {
  @Expose()
  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  @Type(() => Array<ReadServiceDTO>)
  data: ReadServiceDTO;
}
