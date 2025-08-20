/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
      return {
        message: 'Total Reviews found successfully',
        totalReviews,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
