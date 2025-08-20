/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { addReviewDTO } from './dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getTotalReviews(placeItemIdParam) {
    const placeItemId = parseInt(`${placeItemIdParam}`, 10);
    const checkPlaceItem = await this.prisma.placeItem.findUnique({
      where: { id: placeItemId },
    });
    if (!checkPlaceItem) throw new NotFoundException('no place item found');

    try {
      const totalReviews = await this.prisma.review.count({
        where: { placeItemId },
      });
      const avgRates = await this.prisma.review.aggregate({
        _avg: {
          rates: true,
        },
      });
      return {
        message: 'Total Reviews found successfully',
        totalReviews,
        avgRates: avgRates._avg.rates,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllReview(placeItemIdParam) {
    const placeItemId = parseInt(`${placeItemIdParam}`, 10);
    const checkPlaceItem = await this.prisma.placeItem.findUnique({
      where: { id: placeItemId },
    });
    if (!checkPlaceItem) throw new NotFoundException('no place item found');

    try {
      const allReviews = await this.prisma.review.findMany({
        where: { placeItemId },
      });
      return {
        message: 'reviews found successfully',
        data: allReviews,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addReview(dto: addReviewDTO, user) {
    const { placeItemId, content, rates } = dto;
    const userId = user.id;
    const checkPlaceItem = await this.prisma.placeItem.findUnique({
      where: { id: placeItemId },
    });
    if (!checkPlaceItem) throw new NotFoundException('no place item found');

    try {
      const newReview = await this.prisma.review.upsert({
        create: { content, rates, placeItemId, userId },
        update: { content, rates },
        where: {
          userId_placeItemId: {
            placeItemId,
            userId,
          },
        },
      });
      return {
        message: 'a review created successfully',
        data: newReview,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
