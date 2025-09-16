import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkipLogInService {
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

  async fetchAllArticle() {
    try {
      const allArticles = await this.prisma.docItem.findMany({
        include: {
          author: true,
        },
        orderBy: [{ id: 'desc' }],
      });

      return {
        message: 'Articles Are Fetched Successfully !',
        data: allArticles,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
