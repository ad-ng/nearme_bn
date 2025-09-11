/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocItemService {
  constructor(private prisma: PrismaService) {}

  async fetchDocItems(param: CategoryParamDTO, user) {
    const { name } = param;
    const userId = user.id;
    const checkCategory = await this.prisma.category.findFirst({
      where: { name },
    });

    if (!checkCategory) {
      throw new NotFoundException(` no ${name} category found`);
    }

    try {
      const allDocItems = await this.prisma.docItem.findMany({
        where: { categoryId: checkCategory.id },
        include: {
          author: true,
          savedItems: {
            where: { userId },
          },
        },
      });

      return {
        message: 'Documents Fetched Successfully',
        data: allDocItems,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
