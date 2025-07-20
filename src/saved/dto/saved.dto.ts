import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class SavedDTO {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  docItemId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  placeItemId: number;
}
