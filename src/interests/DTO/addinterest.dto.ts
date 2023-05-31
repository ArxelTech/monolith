import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class AddInterestDto {
  @IsNotEmpty()
  @Expose()
  @Type(() => Array<string>)
  @ApiProperty({
    isArray: true,
    type: [String],
  })
  interests: string[];

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  userId: string;
}
