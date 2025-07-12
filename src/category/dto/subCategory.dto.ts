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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'https://livinginkigali.com/wp-content/uploads/2023/03/Gym-life2.jpg',
  })
  featuredImage: string;
}
