import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({ example: '443yy' })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test@122' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
