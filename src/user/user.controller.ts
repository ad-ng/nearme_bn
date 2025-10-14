import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import {
  AdminUpdateUserDTO,
  ChangePasswordDTO,
  CountryDTO,
  EmailConfirmationDTO,
  firebaseDeviceIdDTO,
  NamesDto,
  UpdateUserDTO,
  UserInterestDTO,
} from './dtos';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { EmailDTO } from './dtos/email.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(RolesGuard)
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

  @Patch('firebase')
  changeFirebaseDeviceId(
    @Req() req: Request,
    @Body() dto: firebaseDeviceIdDTO,
  ) {
    return this.userService.updateFirebaseDeviceId(dto, req.user);
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

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('all')
  fetchAllUsers(@Query() query: any) {
    return this.userService.fetchAllUser(query);
  }

  @Get('email/confirmation')
  emailConfirmation(@Req() req: Request) {
    return this.userService.sendEmailConfirmationCode(req.user);
  }

  @Post('otp/verify')
  verifyEmailConfirmationOtp(
    @Body() dto: EmailConfirmationDTO,
    @Req() req: Request,
  ) {
    return this.userService.verifyOtp(dto, req.user);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('search/all')
  searchUser(@Query() query: any) {
    return this.userService.search(query);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Delete(':email')
  deleteUser(@Param() Param: EmailDTO) {
    return this.userService.deleteUser(Param);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  updatePP(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.userService.uploadProfileImage(file, req.user);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Patch('admin/:id')
  adminUpdateUser(
    @Req() req: Request,
    @Body() dto: AdminUpdateUserDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.adminUpdateUser(dto, id);
  }
}
