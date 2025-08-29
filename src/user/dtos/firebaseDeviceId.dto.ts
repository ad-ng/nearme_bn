import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class firebaseDeviceIdDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firebaseDeviceId: string;
}
