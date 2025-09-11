import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceItemDTO } from './dtos';

@Injectable()
export class PlaceItemService {
  constructor(private prisma: PrismaService) {}

  async createPlaceItem(dto: PlaceItemDTO) {
    const {
      businessEmail,
      description,
      location,
      phoneNumber,
      placeImg,
      subCategoryName,
      title,
      workingHours,
      latitude,
      longitude,
    } = dto;

    const checkSubCategory = await this.prisma.subCategory.findFirst({
      where: { name: subCategoryName },
    });

    if (!checkSubCategory) {
      throw new NotFoundException(`no subcategory ${subCategoryName} found`);
    }

    try {
      const newPlaceItem = await this.prisma.placeItem.create({
        data: {
          businessEmail,
          description,
          location,
          phoneNumber,
          placeImg,
          title,
          latitude,
          longitude,
          workingHours,
          subCategoryId: checkSubCategory.id,
        },
      });

      return {
        message: 'New Place Item Added Successfully',
        data: newPlaceItem,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
