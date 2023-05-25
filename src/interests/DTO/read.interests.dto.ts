import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ReadInterestDTO } from './read.interest.dto';

@Exclude()
export class ReadInterestsDTO {
  @Expose()
  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  @Type(() => Array<ReadInterestDTO>)
  data: ReadInterestDTO;
}
