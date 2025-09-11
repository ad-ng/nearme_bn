/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async fetchLocationsInProvince(provinceName: string) {
    const checkProvince = await this.prisma.provinces.findFirst({
      where: { name: provinceName },
    });
    if (!checkProvince) {
      return new NotFoundException(`no ${provinceName} Province found`);
    }

    try {
      const allLocations = await this.prisma.locations.findMany({
        where: { provinceId: checkProvince.id },
      });
      return {
        message: 'Locations found successfully',
        data: allLocations,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchDocItemsInProvince(provinceName: string, user) {
    const userId = user.id;
    const checkProvince = await this.prisma.provinces.findFirst({
      where: { name: provinceName },
    });
    if (!checkProvince) {
      return new NotFoundException(`no ${provinceName} Province found`);
    }

    try {
      const allDocItems = await this.prisma.docItem.findMany({
        where: { provinceId: checkProvince.id },
        include: {
          author: true,
          savedItems: {
            where: { userId },
          },
        },
      });
      return {
        message: 'Doc Items found successfully',
        data: allDocItems,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async adminFetchAllLocations(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const [allLocations, totalCount] = await Promise.all([
        this.prisma.locations.findMany({
          orderBy: [{ id: 'desc' }],
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.locations.count(),
      ]);

      return {
        message: 'Locations Are Fetched Successfully !',
        data: allLocations,
        total: totalCount,
        page,
        limit,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
