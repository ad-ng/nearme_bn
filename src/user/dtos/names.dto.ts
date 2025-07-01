import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NamesDto {
  @ApiProperty({ example: 'KALISA' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
