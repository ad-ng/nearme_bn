import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto } from './dto';

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

  async createCategory(dto: CategoryDto) {
    try {
      const addCategory = await this.prisma.category.upsert({
        where: { name: dto.name },
        create: { name: dto.name },
        update: { name: dto.name },
      });

      return {
        message: 'category added successfully',
        data: addCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
