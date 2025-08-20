import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class addReviewDTO {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  placeItemId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'this such a wonderful place' })
  content: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 3 })
  rates: number;
}
