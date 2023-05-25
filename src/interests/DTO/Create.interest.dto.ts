import { Interestcreateable } from '@app/database';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateInterestDTO implements Partial<Interestcreateable> {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  interest: string;
}
