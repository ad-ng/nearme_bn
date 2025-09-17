/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
import * as admin from 'firebase-admin';

//import { optTemplate } from 'src/mail/templates/otp.template';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin,
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

      await this.prisma.userNotification.create({
        data: { isRead: false, notificationId: 1, userId: newUser.id },
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

  async loginWithGoogle(idToken: string) {
    try {
      // Verify Firebase token
      const decodedToken = await this.firebaseAdmin
        .auth()
        .verifyIdToken(idToken.trim());

      const { uid, email, name, picture, phone_number, aud, exp } =
        decodedToken;

      if (!email) {
        throw new UnauthorizedException('Firebase account has no email');
      }

      // Check if user exists in your database
      let currentUser = await this.prisma.user.findUnique({
        where: { email },
      });

      const firstName: string = name?.split(' ')[0] || '';
      const lastName: string = name?.split(' ').slice(1).join(' ') || '';
      const password = `${uid}${aud}${exp}`;
      const hashedPassword: string = await argon.hash(password);

      if (!currentUser) {
        currentUser = await this.prisma.user.create({
          data: {
            password: hashedPassword,
            email,
            firstName,
            lastName,
            phoneNumber: phone_number,
            profileImg: picture,
          },
        });

        await this.prisma.userInterests.createMany({
          data: [
            { categoryId: 1, userId: currentUser.id },
            { categoryId: 2, userId: currentUser.id },
            { categoryId: 3, userId: currentUser.id },
            { categoryId: 4, userId: currentUser.id },
            { categoryId: 5, userId: currentUser.id },
            { categoryId: 6, userId: currentUser.id },
            { categoryId: 7, userId: currentUser.id },
            { categoryId: 8, userId: currentUser.id },
            { categoryId: 9, userId: currentUser.id },
          ],
        });

        await this.prisma.userNotification.create({
          data: { isRead: false, notificationId: 1, userId: currentUser.id },
        });
      }

      return {
        message: 'user authenticated successfully',
        token: await this.jwt.signAsync(currentUser),
        data: currentUser,
      };
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid or expired Firebase ID token: ${error}`,
      );
    }
  }

  async fetchUserWithIdAndEmail(email: string, id: number) {
    return await this.prisma.user.findUnique({ where: { id, email } });
  }
}
