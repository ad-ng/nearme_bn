/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
        where: { placeItemId },
        _avg: { rates: true },
      });

      const distribution = await this.prisma.review.groupBy({
        by: ['rates'],
        where: { placeItemId },
        _count: { rates: true },
      });

      // Internal numeric distribution
      const fullDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      distribution.forEach((d) => {
        fullDistribution[d.rates] = d._count.rates;
      });

      // Convert numeric -> word keys
      const numberToWord = {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
      };

      const wordDistribution = {};

      for (const star of Object.keys(fullDistribution)) {
        const key = numberToWord[star];
        wordDistribution[key] =
          totalReviews === 0 ? 0 : fullDistribution[star] / totalReviews;
      }

      return {
        message: 'Review stats fetched successfully',
        total: totalReviews,
        avgRates: avgRates._avg.rates,
        distribution: wordDistribution,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllReview(placeItemIdParam, query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    const placeItemId = parseInt(`${placeItemIdParam}`, 10);
    const checkPlaceItem = await this.prisma.placeItem.findUnique({
      where: { id: placeItemId },
    });
    if (!checkPlaceItem) throw new NotFoundException('no place item found');

    try {
      const allReviews = await this.prisma.review.findMany({
        where: { placeItemId },
        include: { user: true },
        take: limit,
        skip: (page - 1) * limit,
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

  async adminFetchAllReviews(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const [allReviews, totalCount] = await Promise.all([
        this.prisma.review.findMany({
          orderBy: [{ id: 'desc' }],
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.review.count(),
      ]);

      return {
        message: 'Reviews Are Fetched Successfully !',
        data: allReviews,
        total: totalCount,
        page,
        limit,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async search(allQuery) {
    const { query } = allQuery;
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const allReviews = await this.prisma.review.findMany({
        where: {
          OR: [
            { content: { contains: query, mode: 'insensitive' } },
            {
              placeItem: { title: { contains: query, mode: 'insensitive' } },
            },
            { user: { email: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'reviews fetched successfully',
        data: allReviews,
        limit,
        page,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
