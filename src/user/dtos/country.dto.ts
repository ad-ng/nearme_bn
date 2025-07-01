import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CountryDTO {
  @ApiProperty({ example: 'Rwanda' })
  @IsNotEmpty()
  @IsString()
  country: string;
}
