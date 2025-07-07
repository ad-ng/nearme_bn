import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CategoryParamDTO {
  @ApiProperty({ example: 'travelinfo' })
  @IsNotEmpty()
  name: string;
}
