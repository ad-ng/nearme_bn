import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { Request } from 'express';
import {
  ChangePasswordDTO,
  CountryDTO,
  NamesDto,
  UpdateUserDTO,
  UserInterestDTO,
} from './dtos';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getCurrentUser(@Req() req: Request) {
    return this.userService.getCurrentUser(req.user);
  }

  @Patch()
  updateCurrentUser(@Req() req: Request, @Body() dto: UpdateUserDTO) {
    return this.userService.updateCurrentUser(dto, req.user);
  }

  @Patch('/password')
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDTO) {
    return this.userService.changePassword(dto, req.user);
  }

  @Patch('names')
  updateNames(@Req() req: Request, @Body() dto: NamesDto) {
    return this.userService.updateNames(dto, req.user);
  }

  @Patch('country')
  updateCountry(@Req() req: Request, @Body() dto: CountryDTO) {
    return this.userService.updateCountry(dto, req.user);
  }

  @Post('interest')
  addingUserInterest(@Body() dto: UserInterestDTO, @Req() req: Request) {
    return this.userService.saveUserInterest(dto, req.user);
  }

  @Delete('interest/:categoryId')
  deletingUserInterest(@Param() Param: any, @Req() req: Request) {
    return this.userService.DeleteUserInterest(Param, req.user);
  }
}
