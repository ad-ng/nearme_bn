/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import {
  ChangePasswordDTO,
  CountryDTO,
  EmailConfirmationDTO,
  firebaseDeviceIdDTO,
  NamesDto,
  UpdateUserDTO,
  UserInterestDTO,
} from './dtos';
import { MailService } from 'src/mail/mail.service';
import { sendEmailConfirmationCode } from 'src/mail/templates/email_confirmation_template';
import { EmailDTO } from 'src/auth/dtos';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getCurrentUser(user) {
    if (!user || !user.email) throw new UnauthorizedException();

    const { email } = user;

    const checkUser = await this.prisma.user.findUnique({
      where: { email },
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

  async updateCurrentUser(dto: UpdateUserDTO, user) {
    const userId = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) {
      throw new ForbiddenException('unregistered user');
    }

    try {
      const newUser = await this.prisma.user.update({
        where: { id: userId },
        data: dto,
      });

      return {
        message: 'user updated successfully',
        data: newUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async changePassword(dto: ChangePasswordDTO, user) {
    const { currentPassword, newPassword } = dto;
    const userId = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) {
      throw new ForbiddenException('unregistered user');
    }

    const checkPassword: boolean = await argon.verify(
      checkUser.password,
      currentPassword,
    );

    if (!checkPassword) {
      throw new ForbiddenException('current password incorrect');
    }

    const hashedPassword: string = await argon.hash(newPassword);

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateFirebaseDeviceId(dto: firebaseDeviceIdDTO, user) {
    const userId = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      throw new ForbiddenException('unregistered user');
    }

    try {
      const newUser = await this.prisma.user.update({
        where: { id: userId },
        data: { firebaseDeviceId: dto.firebaseDeviceId },
      });

      return {
        message: 'firebaseDeviceId updated successfully',
        data: newUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchAllUser(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;
    const order = query.order || 'asc';
    const role = query.role;

    try {
      const [allUsers, totalCount] = await Promise.all([
        this.prisma.user.findMany({
          where: { role },
          orderBy: { id: order },
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.user.count(),
      ]);

      return {
        message: 'user fetched successfully',
        data: allUsers,
        total: totalCount,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendEmailConfirmationCode(user) {
    const { email } = user;

    const checkUser = await this.prisma.user.findUnique({ where: { email } });
    if (!checkUser) {
      throw new NotFoundException(`no user with ${email} found`);
    }

    if (checkUser.isVerified) {
      return {
        message: 'you are already verified',
      };
    }

    const verificationCode = crypto.randomUUID().split('-')[0].substring(0, 5);

    await this.mailService.sendMail(
      email,
      'NearMe Password Reset',
      sendEmailConfirmationCode(
        verificationCode,
        checkUser.firstName,
        checkUser.lastName,
      ),
    );
    await this.prisma.user.update({
      where: { email },
      data: { verificationCode },
    });
    return {
      message: `otp sent to your ${email}`,
    };
  }

  async verifyOtp(dto: EmailConfirmationDTO, user) {
    const { email } = user;
    const { otp } = dto;

    const checkUser = await this.prisma.user.findUnique({ where: { email } });
    if (!checkUser) {
      throw new NotFoundException(`no user with ${email}`);
    }

    if (otp != checkUser.verificationCode) {
      throw new BadRequestException(`incorrect otp`);
    }
    try {
      const newUser = await this.prisma.user.update({
        where: { email },
        data: { isVerified: true, verificationCode: '' },
      });
      return {
        message: 'email has been verified successfully',
        data: newUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async search(keyword: string) {
    try {
      const allUsers = await this.prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: keyword, mode: 'insensitive' } },
            { firstName: { contains: keyword, mode: 'insensitive' } },
            { lastName: { contains: keyword, mode: 'insensitive' } },
          ],
        },
      });

      return {
        message: 'user fetched successfully',
        data: allUsers,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUser(param: EmailDTO) {
    const checkUser = await this.prisma.user.findUnique({
      where: { email: param.email },
    });

    if (!checkUser) {
      throw new NotFoundException(`user not found`);
    }

    try {
      await this.prisma.user.delete({ where: { email: param.email } });
      return { message: 'user deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
