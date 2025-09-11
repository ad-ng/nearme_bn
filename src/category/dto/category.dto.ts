import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ example: 'Hotels' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isDoc: boolean;
}
