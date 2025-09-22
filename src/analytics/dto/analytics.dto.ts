import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AnalyticsDTO {
  @ApiProperty({ example: 'CLICK' })
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  subCategoryId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  placeItemId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  locationId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  docItemId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  provinceId: number;
}
