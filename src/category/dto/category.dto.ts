/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ example: 'Hotels' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase().replace(/\s+/g, ''))
  name: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isDoc: boolean;
}
