import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailConfirmationDTO {
  @ApiProperty({ example: 'djd23' })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
