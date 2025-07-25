import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class PlaceItemDTO {
  @ApiProperty({ example: 'Safe Ride Car' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'jbchbchbchbhfbhbhbchbhcbchchcccvbdbvhcbv' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '8:00 AM - 9:00 PM' })
  @IsNotEmpty()
  @IsString()
  workingHours: string;

  @ApiProperty({ example: 'Kigali - Rwanda' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 'https://img.com' })
  @IsNotEmpty()
  @IsArray()
  placeImg: string[];

  @ApiProperty({ example: 'businessemail@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  businessEmail: string;

  @ApiProperty({ example: '+250787377398' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: 'Private Transport' })
  @IsNotEmpty()
  @IsString()
  subCategoryName: string;
}
