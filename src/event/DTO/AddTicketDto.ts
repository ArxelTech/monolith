import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddTicketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;
}
