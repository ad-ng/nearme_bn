import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SavedService {
  constructor(private prisma: PrismaService) {}

  async fetchSavedInCategory(param: CategoryParamDTO) {
    const { name } = param;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name },
    });
    if (!checkCategory) {
      throw new NotFoundException(`no category with ${name} found !`);
    }

    try {
      // const allSavedPlaceItems = await this.prisma.s
      // return {
      //     message: 'place items saved fetched successfully',
      //     data: allSavedPlaceItems
      // };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
