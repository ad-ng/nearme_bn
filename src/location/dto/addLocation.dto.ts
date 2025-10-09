import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddLocationDTO {
  @ApiProperty({ example: 'Kigali - Rwanda' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Mumarangi' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'a nice place in kigali' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '-1.08763737' })
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty({ example: 30.89892888282 })
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @ApiProperty({ example: 'Northern Province' })
  @IsNotEmpty()
  @IsString()
  provinceName: string;
}
