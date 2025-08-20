/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('total/:placeItemId')
  getTotalReviews(@Param() Param: any) {
    return this.reviewService.getTotalReviews(Param['placeItemId']);
  }
}
