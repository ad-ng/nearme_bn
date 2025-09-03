/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsDTO } from './dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async saveEvent(dto: AnalyticsDTO, user) {
    const userId = user.id;
    const { categoryId, docItemId, locationId, placeItemId, provinceId, type } =
      dto;
    try {
      const newRegisteredEvent = await this.prisma.interactionEvent.create({
        data: {
          categoryId,
          docItemId,
          locationId,
          placeItemId,
          provinceId,
          type,
          userId,
        },
      });
      return {
        message: 'Interaction Event Saved Successfully',
        data: newRegisteredEvent,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
