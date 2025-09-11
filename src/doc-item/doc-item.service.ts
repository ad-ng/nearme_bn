/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocItemDTO } from './dto';

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

  async adminFetchAllArticle(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const [allArticles, totalCount] = await Promise.all([
        this.prisma.docItem.findMany({
          include: {
            author: true,
          },
          orderBy: [{ id: 'desc' }],
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.docItem.count(),
      ]);

      return {
        message: 'Articles Are Fetched Successfully !',
        data: allArticles,
        total: totalCount,
        page,
        limit,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async fetchAllArticle(user) {
    const userId = user.id;
    try {
      const allArticles = await this.prisma.docItem.findMany({
        include: {
          author: true,
          savedItems: {
            where: { userId },
          },
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

  async createDocItem(dto: DocItemDTO, user) {
    const authorId: number = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!checkUser || user.role == 'user') {
      throw new UnauthorizedException();
    }

    const { categoryName, featuredImg, location, title, summary, description } =
      dto;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!checkCategory) {
      throw new NotFoundException(` no ${categoryName} category found`);
    }

    try {
      const newDocItem = await this.prisma.docItem.create({
        data: {
          authorId,
          description,
          summary,
          featuredImg,
          location,
          title,
          categoryId: checkCategory.id,
        },
      });

      return {
        message: 'DocItem Created Successfully',
        data: newDocItem,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
