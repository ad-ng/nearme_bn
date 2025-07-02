import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserInterestDTO {
  @ApiProperty({ example: '1' })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
