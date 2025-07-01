import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { Request } from 'express';
import { CountryDTO, NamesDto } from './dtos';

@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getCurrentUser(@Req() req: Request) {
    return this.userService.getCurrentUser(req.user);
  }

  @Patch('names')
  updateNames(@Req() req: Request, @Body() dto: NamesDto) {
    return this.userService.updateNames(dto, req.user);
  }

  @Patch('country')
  updateCountry(@Req() req: Request, @Body() dto: CountryDTO) {
    return this.userService.updateCountry(dto, req.user);
  }
}
