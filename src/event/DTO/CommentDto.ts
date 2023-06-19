import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isOwner: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isAnonymous: boolean;

  @ApiProperty({
    isArray: true,
    type: [String],
  })
  @Type(() => Array<string>)
  @IsNotEmpty()
  images: string[];
}
