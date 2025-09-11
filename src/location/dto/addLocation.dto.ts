import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddLocationDTO {
  @ApiProperty({ example: 'Kigali - Rwanda' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Mumarangi' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({ example: 'a nice place in kigali' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: -1.08763737 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 30.89892888282 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 'Northern Province' })
  @IsNotEmpty()
  @IsString()
  provinceName: string;
}
