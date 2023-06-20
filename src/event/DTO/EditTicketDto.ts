import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@Exclude()
export class EditTicketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  ticketId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @Expose()
  ticketName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @Expose()
  description: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  @Expose()
  isFree: boolean;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  @Expose()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  @Expose()
  quantity: number;
}
