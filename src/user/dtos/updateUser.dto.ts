import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '2025-06-16 15:37:23.627' })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  dob: Date;

  @ApiProperty({ example: '+250782755794' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'Rwanda' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ example: 'Male' })
  @IsNotEmpty()
  @IsString()
  gender: string;
}
