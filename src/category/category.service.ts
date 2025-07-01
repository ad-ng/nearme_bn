import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async fetchAllCategories() {
    try {
      const allCategories = await this.prisma.category.findMany();

      return {
        message: 'categories fetched successfully',
        data: allCategories,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
