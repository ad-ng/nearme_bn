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

  console.log('###########################################################');
  console.log(' user seed added successfully');
  console.log('###########################################################');

  await prisma.category.createMany({
    data: [
      { name: 'Travel Info', isDoc: true }, // 1
      { name: 'Transport Services', isDoc: false }, // 2
      { name: 'Accommodation & Booking', isDoc: false }, // 3
      { name: 'Activities & Things To Do', isDoc: true }, // 4
      { name: 'Food & Dinning', isDoc: false }, // 5
      { name: 'Shopping', isDoc: false }, // 6
      { name: 'Health & Wellness', isDoc: false }, // 7
      { name: 'Government Services', isDoc: true }, // 8
      { name: 'Local Culture', isDoc: true }, // 9
    ],
  });

  console.log('###########################################################');
  console.log(' categories seeds added successfully');
  console.log('###########################################################');

  await prisma.subCategory.createMany({
    data: [
      {
        name: 'Public Transport',
        categoryId: 2,
        featuredImage: `https://www.ktpress.rw/wp-content/uploads/2023/12/GBFAeOXW0AEu94j.jpg`,
      }, // 1
      {
        name: 'Private Taxi',
        categoryId: 2,
        featuredImage: `https://bammtours.co.ke/wp-content/uploads/2021/05/Nairobi-airport-cabs.jpg`,
      }, // 2
      {
        name: 'Airport Pickup',
        categoryId: 2,
        featuredImage: `https://www.rac.co.rw/fileadmin/user_upload/our_service_images/ATAK.jpeg`,
      }, // 3
      {
        name: 'Safaris Transport',
        categoryId: 2,
        featuredImage: `https://rwandaecocompany.com/wp-content/uploads/2022/09/akagera.jpg`,
      }, // 4
      {
        name: 'Hotels',
        categoryId: 3,
        featuredImage: `https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2019/02/RADISON-BLUE-HOTEL-CONVENTION-CENTER-KIGALI.jpg?ssl=1`,
      }, // 5
      {
        name: 'Motels',
        categoryId: 3,
        featuredImage: `https://cf.bstatic.com/static/img/theme-index/bg_motels/d856398f47116cf15b08e830bfd63530539cd8e1.jpg`,
      }, // 6
      {
        name: 'Guest Houses',
        categoryId: 3,
        featuredImage: `https://images.trvl-media.com/lodging/92000000/91620000/91616900/91616900/d0a33dea.jpg`,
      }, // 7
      {
        name: 'Lodges',
        categoryId: 3,
        featuredImage: `https://lirp.cdn-website.com/396dd29d/dms3rep/multi/opt/Luxury+Lodges+in+Rwanda.jpg-1920w.webp`,
      }, // 8
      {
        name: 'Restaurants',
        categoryId: 5,
        featuredImage: `https://ultimatewildsafaris.com/images/rwanda_Restaurants.jpg`,
      }, // 9
      {
        name: 'Coffee Shops',
        categoryId: 5,
        featuredImage: `https://sprudge.com/wp-content/uploads/2019/07/Question-Coffee-Gishushu-Kigali-Rwanda-6.jpg`,
      }, // 10
      {
        name: 'Supermarkets',
        categoryId: 6,
        featuredImage: `https://www.simbaonlineshopping.com/Images/EdableOils.jpg`,
      }, // 11
      {
        name: 'Local Markets',
        categoryId: 6,
        featuredImage: `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/87/67/68/20190602-112015-largejpg.jpg`,
      }, // 12
      {
        name: 'Mini Markets',
        categoryId: 6,
        featuredImage: `https://c8.alamy.com/comp/ETF0A9/street-scene-with-brightly-painted-shops-nyamirambo-kigali-rwanda-ETF0A9.jpg`,
      }, // 13
      {
        name: 'Hospitals',
        categoryId: 7,
        featuredImage: `https://api.brusselstimes.com/wp-content/uploads/2021/02/rwanda-hospital-c-city-of-kigali.jpg`,
      }, // 14
      {
        name: 'Clinics',
        categoryId: 7,
        featuredImage: `https://www.entandaudiologynews.com/media/35440/ent-ma-24-reception-area-of-clinic.jpg`,
      }, // 15
      {
        name: 'Pharmacy',
        categoryId: 7,
        featuredImage: `https://www.wearetech.africa/media/k2/items/cache/38252c55502a1b07ebc1bd14c44c1fcb_XL.jpg`,
      }, // 16
      {
        name: 'Massage & Sauna',
        categoryId: 7,
        featuredImage: `https://www.newtimes.co.rw/thenewtimes/uploads/images/2025/01/24/thumbs/1200x700/68989.jpg`,
      }, // 17
      {
        name: 'Gym',
        categoryId: 7,
        featuredImage: `https://livinginkigali.com/wp-content/uploads/2023/03/Gym-life2.jpg`,
      }, // 18
    ],
  });

  console.log('###########################################################');
  console.log(' subcategories seed added successfully');
  console.log('###########################################################');

  await prisma.placeItem.createMany({
    data: [
      {
        title: `Move by Volkswagen`,
        description: `From full fleet solution management for your businesses to your daily personal journeys, we offer you state-of-the-art, high-spec, high-tech, beautifully designed Volkswagen Vehicles assembled in Rwanda. The range on offer includes the classy new Polo, the sleek Passat, the spacious Teramont. All services will be available on our easy to use Move App. Volkswagen Mobility Solutions Rwanda is a 100% owned subsidiary of Volkswagen Group South Africa.`,
        location: `Kigali`,
        businessEmail: `info@volkswagen.com`,
        phoneNumber: `+250780000000`,
        subCategoryId: 2,
        workingHours: `24 Hours`,
        placeImg: [
          'https://assets.volkswagen.com/is/image/volkswagenag/price-and-optionshb?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTE5MjAmaGVpPTEwODAmYWxpZ249MC4wMCwwLjAwJmJmYz1vZmYmM2E1Nw==',
          'https://assets.volkswagen.com/is/image/volkswagenag/Amarok_SSA_Mofa?Zml0PWNyb3AsMSZmbXQ9d2VicC1hbHBoYSZxbHQ9Nzkmd2lkPTEyODAmYmZjPW9mZiY4YTNi',
          'https://assets.volkswagen.com/is/image/volkswagenag/safety-7?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTE5MjAmYWxpZ249MC4wMCwwLjAwJmJmYz1vZmYmNzgwOQ==',
        ],
      },
      {
        title: `YEGO MOTTO`,
        description: `YEGOMOTO changes this forever. Simply flag down a YEGOMOTO, tell the Driver where to go, hop on, and be on your way! Passengers will pay the fare displayed on the YEGOMOTO Meter at the end of a trip. Fares are calculated automatically according to distance travelled. Additional waiting charges may apply. No more haggling on how much you need to pay. Imagine the time you will save, every single day! YEGOMOTO adds precious minutes back to your life and gets you to your destination quicker.`,
        location: `Kigali, Rwanda`,
        businessEmail: `info@yegomoto.com`,
        phoneNumber: `+250783919191`,
        subCategoryId: 2,
        workingHours: `24 Hours`,
        placeImg: [
          'https://rba.co.rw/admin/media_data/cover_photo/IKORA29775.jpg',
          'https://www.yegomoto.com/videos/vid_3.jpg',
          'https://www.wearetech.africa/media/k2/items/cache/ca2d3b9781db35243fe5868c79aba4c0_XL.jpg',
          'https://www.ktpress.rw/wp-content/uploads/2017/10/yego-moto-driver.jpg',
        ],
      },
      {
        title: `KIGALI AIRPORT TRANSFERS`,
        description: `We provide both individuals and travel agents the most affordable, reliable, polite friendly service and quality airport taxi transfer services, anytime and anywhere.All our drivers are experienced Taxi Cab Drivers who have exemplary performance records. Travelling with comfort is our company's goal and top priority. We care about your experience anywhere you go`,
        location: `Kigali, Rwanda`,
        businessEmail: `info@kigalishuttle.com`,
        phoneNumber: `+250783698911`,
        subCategoryId: 3,
        workingHours: `24 Hours`,
        placeImg: [
          'https://kigaliairporttaxitransfers.com/wp-content/uploads/2025/02/IMG_20231208_111107_972-scaled.jpg',
        ],
      },
      {
        title: `Rwanda Safari Tour`,
        description: `Rwanda Safari Tour/Rwanda tours /Rwanda safaris are one of the best wildlife Expeditions that travelers can engage in when they plan to visit East Africa. Rwanda is a blessed country that has recently gained a wide exposure to the world and therefore a large number of travelers have flocked the country to be able to explore Rwanda on a Rwanda safari and its attractive feature with ofcourse the major attraction being gorilla trekking /Rwanda gorilla tour or Simply Rwanda gorilla trekking in Volcanoes national park.`,
        location: `Kigali, Rwanda`,
        businessEmail: `info@rwandasafaritour.com`,
        phoneNumber: `+250780870670`,
        subCategoryId: 4,
        workingHours: `24 Hours`,
        placeImg: [
          'https://kigaliairporttaxitransfers.com/wp-content/uploads/2025/02/IMG_20231208_111107_972-scaled.jpg',
        ],
      },
      {
        title: `Rwanda Eco Company & Safaris.`,
        description: `Rwanda Eco Company and Safaris is a local safari specialist, based in Kigali- Rwanda and Arusha - Tanzania specializes in arranging thrilling lifetime Safari Experiences. Our philosophy emphasises the participation of local communities in the tourism industry in order to let them benefit from East Africa's growing popularity. Additionally, we pay great attention to the protection and conservation of our environment including natural habitats and rural villages to become a more sustainable travel destination in the long term. Our trips perfectly combine the varied landscapes with outdoor activities as well as cultural tours in urban areas to create an authentic and unforgettable experience for the clients.`,
        location: `Kigali, Rwanda`,
        businessEmail: `info@rwandaecocompany.com`,
        phoneNumber: `+250788508228`,
        subCategoryId: 4,
        workingHours: `24 Hours`,
        placeImg: [
          'https://rwandaecocompany.com/wp-content/uploads/2022/09/akagera.jpg',
        ],
      },
    ],
  });
  console.log('###########################################################');
  console.log(' place items seed added successfully');
  console.log('###########################################################');

  await prisma.docItem.createMany({
    data: [
      {
        title: `How To Get A Rwandan Visa`,
        authorId: 1,
        categoryId: 1,
        description: `1. Visa on Arrival:
As of January 1, 2018, nationals of all countries can obtain a 30-day visa upon arrival at Kigali International Airport and all land borders. 
This option eliminates the need for prior application. 
The visa fee is usually around 50 USD for a single entry visa. 
2. Online Application via Irembo:
The Rwanda e-government portal, Irembo, is the official platform for online visa applications. 
You can apply for various visa types, including single entry, multiple entry, and the East Africa Tourist Visa. 
The application process involves creating an account, selecting your visa type, providing applicant details, uploading required documents, and making the payment (if applicable). 
Important: Irembo is the only authorized online platform. Be cautious of other websites claiming to offer online visa services, as they may not be legitimate. `,
        featuredImg: `https://turkanawildlifesafaris.com/wp-content/uploads/2024/05/a058077a9621413199d756d7d30a7108.jpg`,
        summary: `To obtain a Rwandan visa, you have two main options: visa on arrival or online application through IremboGov. For most nationalities, a 30-day visa is available upon arrival at Kigali International Airport or any border crossing. If you prefer, you can also apply online via the Irembo e-government portal before your trip.`,
        location: `Kigali - Rwanda`,
      },
      {
        title: `How To Renew Your Resident Permit In Rwanda`,
        authorId: 1,
        categoryId: 1,
        description: `Detailed Steps:
Visit the IremboGov platform: Go to www.irembo.gov.rw. 
Navigate to Permits: Under "Immigration and Emigration", click on "Permits". 
Select Renew Permit: Choose the "Renew permit" request type and click "Apply". 
Fill in Details: Enter your demographic information, request details, and travel information. 
Attach Documents: Upload the required documents, including a copy of your passport (PDF, 500KB). The specific attachments may vary based on the type of permit. 
Verify and Submit: Double-check the entered information, provide your phone number and/or email, and submit the application. 
Payment (if required): If the renewal isn't free, you'll receive a billing ID to make the payment. 
Receive Notification: After successful payment, you'll receive a notification about when and where to pick up your renewed permit from the DGIE office. `,
        featuredImg: `https://livinginkigali.com/wp-content/uploads/2023/03/mana5280-ivG8LkDrtjs-unsplash.jpg`,
        summary: `To renew your resident permit in Rwanda, you need to apply through the IremboGov platform under the "Immigration and Emigration" section, selecting "Permits" and then "Renew permit". You'll need to provide your demographic details, request and travel information, and attach necessary documents like a copy of your passport. After successful application and payment (if required), you'll receive a notification about the pickup of your renewed permit at the DGIE office. `,
        location: `Kigali - Rwanda`,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
