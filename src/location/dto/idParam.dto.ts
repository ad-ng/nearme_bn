import { IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class IdParamDTO {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;
}
