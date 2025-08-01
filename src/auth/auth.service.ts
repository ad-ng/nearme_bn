import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import {
  EmailDTO,
  loginDTO,
  OtpVerification,
  RegisterDTO,
  ResetPasswordDTO,
} from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { pwResetTemplate } from 'src/mail/templates/pw_reset.template';
//import { optTemplate } from 'src/mail/templates/otp.template';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async signin(dto: loginDTO) {
    const { email, password } = dto;

    const currentUser = await this.prisma.user.findUnique({ where: { email } });

    if (!currentUser) {
      throw new ForbiddenException('invalid credentials');
    }

    const checkPassword: boolean = await argon.verify(
      currentUser.password,
      password,
    );

    if (!checkPassword) {
      throw new ForbiddenException('invalid credentials');
    }

    return {
      message: 'user authenticated successfully',
      token: await this.jwt.signAsync(currentUser),
      data: currentUser,
    };
  }

  async register(dto: RegisterDTO) {
    const { email, password, dob, firstName, lastName, phoneNumber } = dto;

    const checkEmail = await this.prisma.user.findUnique({ where: { email } });

    if (checkEmail) throw new BadRequestException('email already exist');

    const hashedPassword: string = await argon.hash(password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          password: hashedPassword,
          email,
          firstName,
          dob,
          lastName,
          phoneNumber,
        },
      });

      await this.prisma.userInterests.createMany({
        data: [
          { categoryId: 1, userId: newUser.id },
          { categoryId: 2, userId: newUser.id },
          { categoryId: 3, userId: newUser.id },
          { categoryId: 4, userId: newUser.id },
          { categoryId: 5, userId: newUser.id },
          { categoryId: 6, userId: newUser.id },
          { categoryId: 7, userId: newUser.id },
          { categoryId: 8, userId: newUser.id },
          { categoryId: 9, userId: newUser.id },
        ],
      });

      return {
        message: 'the user registered successfully',
        token: this.jwt.sign(newUser),
        data: newUser,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async sendEmailPasswordResetCode(dto: EmailDTO) {
    const { email } = dto;

    const checkUser = await this.prisma.user.findUnique({ where: { email } });
    if (!checkUser) {
      throw new NotFoundException(`no user with ${email} found`);
    }

    const verificationCode = crypto.randomUUID().split('-')[0].substring(0, 5);

    await this.mailService.sendMail(
      email,
      'NearMe Password Reset',
      pwResetTemplate(verificationCode),
    );
    await this.prisma.user.update({
      where: { email },
      data: { verificationCode },
    });
    return {
      message: `otp sent to your ${email}`,
    };
  }

  async verifyOtp(dto: OtpVerification) {
    const { otp, email } = dto;

    const checkUser = await this.prisma.user.findUnique({ where: { email } });
    if (!checkUser) {
      throw new NotFoundException(`no user with ${email}`);
    }

    if (otp != checkUser.verificationCode) {
      throw new BadRequestException(`incorrect otp`);
    }

    return {
      message: 'otp has been verified successfully',
    };
  }

  async resetPassword(dto: ResetPasswordDTO) {
    const { otp, email, password } = dto;

    const checkUser = await this.prisma.user.findUnique({ where: { email } });
    if (!checkUser) {
      throw new NotFoundException(`no user with ${email}`);
    }

    if (otp != checkUser.verificationCode) {
      throw new BadRequestException(`incorrect otp`);
    }

    try {
      const hashedPassword: string = await argon.hash(password);
      await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassword, verificationCode: '' },
      });

      return {
        message: 'password reset successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
