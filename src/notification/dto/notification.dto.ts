import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NotificationDTO {
  @ApiProperty({ example: 2 })
  @IsOptional()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 'ALERT' })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({ example: 'Beware of heavy rain!' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'stay safe djehbhb hbjb' })
  @IsNotEmpty()
  @IsString()
  body: string;
}
