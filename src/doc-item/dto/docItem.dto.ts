import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DocItemDTO {
  @ApiProperty({ example: 'How To Get a Rwandan Driving License' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Travel Info' })
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @ApiProperty({ example: 'Kigali - Rwanda' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 'dhjbjbhjdbhfhbbfbc hfbhfbhbfhf' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'dhjbjbhjdbhfhbbfbc hfbhfbhbfhf' })
  @IsNotEmpty()
  @IsString()
  summary: string;
}
