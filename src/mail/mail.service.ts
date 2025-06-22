/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // or your SMTP server
      port: 587,
      secure: false, // true for port 465, false for others
      auth: {
        user: process.env.GMAIL_USER, // 🔐 use env vars
        pass: process.env.GMAIL_PASS, // generate App Password in Gmail
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const info = await this.transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  }
}
