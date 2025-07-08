/* eslint-disable @typescript-eslint/no-misused-promises */
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('###########################################################');
  await prisma.user.create({
    data: {
      email: 'johndoe@gmail.com',
      password: await argon.hash('test@123'),
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      dob: faker.date.birthdate(),
      role: 'admin',
      isVerified: true,
      country: 'Rwanda',
      Status: 'Local',
    },
  });

  await prisma.category.createMany({
    data: [
      { name: 'Travel Info', isDoc: true },
      { name: 'Transport Services', isDoc: false },
      { name: 'Accommodation & Booking', isDoc: false },
      { name: 'Activities & Things To Do', isDoc: true },
      { name: 'Food & Dinning', isDoc: false },
      { name: 'Shopping', isDoc: false },
      { name: 'Health & Wellness', isDoc: false },
      { name: 'Government Services', isDoc: true },
      { name: 'Local Culture', isDoc: true },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
