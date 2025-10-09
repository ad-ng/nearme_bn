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
import { IdParamDTO } from 'src/location/dto';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class DocItemService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async fetchDocItems(param: CategoryParamDTO, user, query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

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
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'Documents Fetched Successfully',
        data: allDocItems,
        limit,
        page,
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

  async fetchAllArticle(user, query) {
    const userId = user.id;
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const allArticles = await this.prisma.docItem.findMany({
        include: {
          author: true,
          savedItems: {
            where: { userId },
          },
        },
        orderBy: [{ id: 'desc' }],
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'Articles Are Fetched Successfully !',
        data: allArticles,
        limit,
        page,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async createDocItem(dto: DocItemDTO, user, file: Express.Multer.File) {
    if (file == null) {
      return 'no file added';
    }

    const authorId: number = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!checkUser || user.role == 'user') {
      throw new UnauthorizedException();
    }

    const { categoryName, location, title, summary, description } = dto;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!checkCategory) {
      throw new NotFoundException(` no ${categoryName} category found`);
    }

    try {
      const fileName = `article/${title.trim().split(' ').join('-')}`;

      const imageUrl: string = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/${fileName}`;

      await this.imagesService.uploadSingleImage(file, fileName);

      const newDocItem = await this.prisma.docItem.create({
        data: {
          authorId,
          description,
          summary,
          featuredImg: imageUrl,
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
  async updateDocItem(
    dto: DocItemDTO,
    param: IdParamDTO,
    file: Express.Multer.File,
  ) {
    const docItemId = param.id;
    const checkDocItemId = await this.prisma.docItem.findUnique({
      where: { id: docItemId },
    });

    if (!checkDocItemId) {
      throw new NotFoundException('doc item not found');
    }

    const { categoryName, location, title, summary, description } = dto;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!checkCategory) {
      throw new NotFoundException(` no ${categoryName} category found`);
    }

    try {
      // Case 1: No new file
      if (!file) {
        const newDocItem = await this.prisma.docItem.update({
          where: { id: docItemId },
          data: {
            description,
            summary,
            location,
            title,
            categoryId: checkCategory.id,
          },
        });

        return {
          message: 'DocItem updated Successfully',
          data: newDocItem,
        };
      }

      // Case 2: New file provided
      let fileName: string;

      if (checkDocItemId.featuredImg) {
        // Extract old file name from URL
        const extractFilePath = (url: string): string => {
          const base = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/`;
          return url.replace(base, '');
        };

        fileName = extractFilePath(checkDocItemId.featuredImg);
      } else {
        // New subcategory image
        fileName = `article/${title.trim().split(' ').join('-')}`;
      }

      await this.imagesService.uploadSingleImage(file, fileName);

      const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/${fileName}`;

      const newDocItem = await this.prisma.docItem.update({
        where: { id: docItemId },
        data: {
          description,
          summary,
          featuredImg: imageUrl,
          location,
          title,
          categoryId: checkCategory.id,
        },
      });

      return {
        message: 'DocItem updated Successfully',
        data: newDocItem,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async deleteDocItem(param: IdParamDTO) {
    const docItemId = param.id;
    const CheckDocItem = await this.prisma.docItem.findUnique({
      where: { id: docItemId },
    });

    if (!CheckDocItem) {
      throw new NotFoundException('doc item not found');
    }

    const extractFilePath = (url: string): string => {
      const base = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/`;
      return url.replace(base, '');
    };

    const fileName = extractFilePath(CheckDocItem.featuredImg);

    try {
      await this.imagesService.deleteImage(fileName);
      await this.prisma.docItem.delete({
        where: { id: docItemId },
      });

      return {
        message: 'Doc item deleted successfully',
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async search(allQuery: any) {
    const { query } = allQuery;
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const allArticles = await this.prisma.docItem.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { email: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'articles fetched successfully',
        data: allArticles,
        limit,
        page,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
