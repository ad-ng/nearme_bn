import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './dtos';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'log in a user' })
  @ApiBadRequestResponse({
    description: 'incorrect data from user',
    example: {
      message: [
        'email must be an email',
        'email should not be empty',
        'password should not be empty',
        'password must be a string',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiForbiddenResponse({
    description: 'used when no account matched the entered data',
    example: {
      message: 'invalid credentials',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiCreatedResponse({ description: 'When authentication succeeded' })
  @Post('/login')
  login(@Body() dto: loginDTO) {
    return this.authService.signin(dto);
  }
}
