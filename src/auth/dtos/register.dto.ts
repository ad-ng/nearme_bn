import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ example: 'JOHN' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2025-06-16 15:37:23.627' })
  @IsNotEmpty()
  @IsDateString()
  dob: Date;

  @ApiProperty({ example: 'test@123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
