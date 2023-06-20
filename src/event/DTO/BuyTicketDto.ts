import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BuyTicketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ticketId: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  transactionId: number;

  @IsNumber()
  @ApiProperty()
  quantity: number;
}
