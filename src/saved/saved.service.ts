/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SavedService {
  constructor(private prisma: PrismaService) {}

  async fetchSavedInCategory(param: CategoryParamDTO, user) {
    const { name } = param;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name },
    });
    if (!checkCategory) {
      throw new NotFoundException(`no category with ${name} found !`);
    }

    const userId = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      throw new ForbiddenException();
    }

    try {
      const allSavedPlaceItems = await this.prisma.saved.findMany({
        where: {
          OR: [
            { docItem: { categoryId: checkCategory.id } },
            { placeItem: { subCategory: { categoryId: checkCategory.id } } },
          ],
        },
      });

      return {
        message: 'place items saved fetched successfully',
        data: allSavedPlaceItems,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
