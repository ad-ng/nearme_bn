/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CountryDTO, NamesDto, UserInterestDTO } from './dtos';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(user) {
    const { id } = user;

    const checkUser = await this.prisma.user.findUnique({
      where: { id },
      include: { userInterests: true },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');

    return {
      message: 'user found successfully',
      data: checkUser,
    };
  }

  async updateNames(dto: NamesDto, user) {
    const { id } = user;

    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return {
        message: 'names updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateCountry(dto: CountryDTO, user) {
    const { id } = user;

    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return {
        message: 'country updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async saveUserInterest(dto: UserInterestDTO, user) {
    const { categoryId } = dto;

    const userId: number = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');
    try {
      const savedInterest = await this.prisma.userInterests.upsert({
        where: {
          userId_categoryId: {
            userId,
            categoryId,
          },
        },
        create: { categoryId, userId },
        update: { categoryId, userId },
      });
      return {
        message: 'interest saved successfully',
        data: savedInterest,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async DeleteUserInterest(param, user) {
    const categoryId: number = parseInt(param.categoryId, 10);

    const userId: number = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');

    const checkInterest = await this.prisma.userInterests.findUnique({
      where: {
        userId_categoryId: {
          userId,
          categoryId,
        },
      },
    });

    if (!checkInterest) {
      return {
        message: 'interest deleted successfully',
      };
    }
    try {
      await this.prisma.userInterests.delete({
        where: {
          userId_categoryId: {
            userId,
            categoryId,
          },
        },
      });
      return {
        message: 'interest deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
