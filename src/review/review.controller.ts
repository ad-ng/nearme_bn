/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request } from 'express';
import { addReviewDTO } from './dto';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('total/:placeItemId')
  getTotalReviews(@Param() Param: any) {
    return this.reviewService.getTotalReviews(Param['placeItemId']);
  }

  @Get(':placeItemId')
  getAllReviews(@Param() Param: any) {
    return this.reviewService.getAllReview(Param['placeItemId']);
  }

  @Post()
  addReview(@Req() req: Request, @Body() dto: addReviewDTO) {
    return this.reviewService.addReview(dto, req.user);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('/admin/all')
  gettingAllBuz(@Query() query: any) {
    return this.reviewService.adminFetchAllReviews(query);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('search/all')
  searchUser(@Query('query') query: string) {
    return this.reviewService.search(query);
  }
}
