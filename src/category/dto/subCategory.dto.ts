import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Public Transport' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '3' })
  categoryId: number;
}
