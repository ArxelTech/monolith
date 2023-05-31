import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDto implements Partial<User> {
  @Expose()
  @IsString()
  @ApiProperty({
    nullable: true,
  })
  username?: string;

  @Expose()
  @IsString()
  @ApiProperty({
    nullable: true,
  })
  fullName?: string;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    nullable: true,
  })
  isBusiness?: boolean;
}
