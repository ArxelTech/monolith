import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class Tickets {
  @ApiProperty()
  @IsString()
  ticketName: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  isFree: boolean;

  @ApiProperty()
  @IsBoolean()
  isUnlimited: boolean;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lga: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  time: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasTickets: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isDraft: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isLiveEvent: boolean;

  @ApiProperty({
    isArray: true,
    type: String,
  })
  @Type(() => Array<string>)
  people: string[];

  @ApiProperty({
    isArray: true,
    type: Tickets,
  })
  @Type(() => Array<Tickets>)
  tickets: Tickets[];
}
