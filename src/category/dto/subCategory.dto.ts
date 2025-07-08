import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Public Transport' })
  subCategoryName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Transport Services' })
  categoryName: string;
}
