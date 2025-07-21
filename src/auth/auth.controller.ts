import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDTO, loginDTO, OtpVerification, RegisterDTO } from './dtos';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'log in a user' })
  @ApiInternalServerErrorResponse({ description: 'for server issues' })
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
  @ApiCreatedResponse({
    description: 'When authentication succeeded',
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSk9ITiIsImxhc3ROYW1lIjoiRG9lIiwiZ2VuZGVyIjpudWxsLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwiaXNWZXJpZmllZCI6ZmFsc2UsInBhc3N3b3JkIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTMscD00JEJEeDFZaTZQNHVyLzdLaWo2YW94ZXckSUFucnBHeHBvd3JqbHlHeTJrWTAwUXB2OGt3ODdWdU81Z2UwQWFNcnZLayIsImNvdW50cnkiOm51bGwsIlN0YXR1cyI6bnVsbCwicHJvZmlsZUltZyI6bnVsbCwiZG9iIjoiMjAyNS0wNi0xNlQxMzozNzoyMy42MjdaIiwidmVyaWZpY2F0aW9uQ29kZSI6bnVsbCwicGhvbmVOdW1iZXIiOm51bGwsInJvbGUiOiJ1c2VyIiwiY3JlYXRlZEF0IjoiMjAyNS0wNi0yMlQwNToxMDowOC4wOTVaIiwiaWF0IjoxNzUwNTY5MTE3fQ.ISXJv7Zd41Ly_tUdHGSGTKzBP4u1puXOwTXI78GvT8A',
      data: {
        id: 1,
        firstName: 'JOHN',
        lastName: 'Doe',
        gender: null,
        email: 'johndoe@gmail.com',
        isVerified: false,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$BDx1Yi6P4ur/7Kij6aoxew$IAnrpGxpowrjlyGy2kY00Qpv8kw87VuO5ge0AaMrvKk',
        country: null,
        Status: null,
        profileImg: null,
        dob: '2025-06-16T13:37:23.627Z',
        verificationCode: null,
        phoneNumber: null,
        role: 'user',
        createdAt: '2025-06-22T05:10:08.095Z',
      },
    },
  })
  @Post('login')
  login(@Body() dto: loginDTO) {
    return this.authService.signin(dto);
  }

  @ApiOperation({ summary: 'registering a user' })
  @ApiBadRequestResponse({
    description: 'Bad request due to invalid input or duplicate email',
    examples: {
      EmailExists: {
        summary: 'Email already exists',
        value: {
          message: 'email already exist',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      MissingPassword: {
        summary: 'Missing fields',
        value: {
          message: [
            'firstName must be a string',
            'firstName should not be empty',
            'lastName must be a string',
            'lastName should not be empty',
            'email must be an email',
            'email should not be empty',
            'dob must be a Date instance',
            'dob should not be empty',
            'password must be a string',
            'password should not be empty',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'for success',
    example: {
      message: 'the user registered successfully',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiSk9ITiIsImxhc3ROYW1lIjoiRG9lIiwiZ2VuZGVyIjpudWxsLCJlbWFpbCI6ImpvaG5kb2UxQGdtYWlsLmNvbSIsImlzVmVyaWZpZWQiOmZhbHNlLCJwYXNzd29yZCI6IiRhcmdvbjJpZCR2PTE5JG09NjU1MzYsdD0zLHA9NCQ0U3p6REhJYUc2SnM2UGRkbHVIaVp3JEk5Tmg4TDJqSFk2K2k0VTFXc3ZUazM0eHNubFlKeXVlMmxxTHN3bHdEOTAiLCJjb3VudHJ5IjpudWxsLCJTdGF0dXMiOm51bGwsInByb2ZpbGVJbWciOm51bGwsImRvYiI6IjIwMjUtMDYtMTZUMTM6Mzc6MjMuNjI3WiIsInZlcmlmaWNhdGlvbkNvZGUiOm51bGwsInBob25lTnVtYmVyIjpudWxsLCJyb2xlIjoidXNlciIsImNyZWF0ZWRBdCI6IjIwMjUtMDYtMjJUMDU6MzM6MTQuNjUzWiIsImlhdCI6MTc1MDU3MDM5NH0.T-XfQWVWAJXmZ71fiMgUhzVNMyB59lJALR2aKoUoT0g',
      data: {
        id: 1,
        firstName: 'JOHN',
        lastName: 'Doe',
        gender: null,
        email: 'johndoe@gmail.com',
        isVerified: false,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$BDx1Yi6P4ur/7Kij6aoxew$IAnrpGxpowrjlyGy2kY00Qpv8kw87VuO5ge0AaMrvKk',
        country: null,
        Status: null,
        profileImg: null,
        dob: '2025-06-16T13:37:23.627Z',
        verificationCode: null,
        phoneNumber: null,
        role: 'user',
        createdAt: '2025-06-22T05:10:08.095Z',
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: 'error from server' })
  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post('email/verification')
  emailVerification(@Body() dto: EmailDTO) {
    return this.authService.sendEmailPasswordResetCode(dto);
  }
  @Post('otp/verification')
  otpVerification(@Body() dto: OtpVerification) {
    return this.authService.verifyOtp(dto);
  }
}
