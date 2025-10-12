/* eslint-disable @typescript-eslint/no-misused-promises */
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('###########################################################');
  await prisma.user.createMany({
    data: [
      {
        email: 'johndoe@gmail.com',
        password: await argon.hash('test@123'),
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        profileImg:
          'https://i.pinimg.com/236x/e0/80/0f/e0800f7b5c41163750fc80324116142a.jpg',
        dob: faker.date.birthdate(),
        role: 'admin',
        isVerified: true,
        country: 'Rwanda',
      },
      {
        email: 'mbonimpaclaude27@gmail.com',
        password: await argon.hash('test@123'),
        firstName: 'MBONIMPA',
        lastName: 'Claude',
        gender: 'male',
        dob: faker.date.birthdate(),
        role: 'moderator',
        isVerified: true,
        profileImg:
          'https://i.pinimg.com/236x/e0/80/0f/e0800f7b5c41163750fc80324116142a.jpg',
        country: 'Rwanda',
      },
    ],
  });

  for (let i = 1; i < 11; i++) {
    const gender = i % 2 == 0 ? 'male' : 'female';
    const role = i % 2 == 0 ? 'admin' : 'user';
    const hashedPassword = await argon.hash('test@123');
    await prisma.user.create({
      data: {
        email: `${i}${faker.internet.email()}`,
        password: hashedPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: gender,
        dob: faker.date.birthdate(),
        phoneNumber: faker.phone.number(),
        role: role,
        country: faker.location.country(),
        profileImg:
          'https://i.pinimg.com/236x/e0/80/0f/e0800f7b5c41163750fc80324116142a.jpg',
        isVerified: faker.datatype.boolean(),
      },
    });
  }

  console.log(' user seed added successfully');
  console.log('###########################################################');

  await prisma.provinces.createMany({
    data: [
      {
        name: 'Kigali City',
        image:
          'https://www.kcc.rw/uploads/9/8/2/4/98249186/kigali-convention-centre-exterior_orig.jpg',
      },
      {
        name: 'North Province',
        image:
          'https://www.newtimes.co.rw/thenewtimes/uploads/images/2023/03/17/thumbs/1200x700/14341.jpg',
      },
      {
        name: 'West Province',
        image:
          'https://pantheradventures.com/wp-content/uploads/2024/01/lake_kivu_serena_hotel_beach.jpg',
      },
      {
        name: 'South Province',
        image:
          'https://www.ugandarwanda-safaris.com/wp-content/uploads/2024/12/Kings-Palace-Nyanza-1024x675.jpg',
      },
      {
        name: 'East Province',
        image:
          'https://www.rwandacarrentalservices.com/wp-content/uploads/2020/07/game-drive-rwanda.gif',
      },
    ],
  });
  console.log(' Provinces seeds added successfully');
  console.log('###########################################################');

  await prisma.locations.createMany({
    data: [
      {
        address: 'Kigali, Nyamirambo',
        title: 'Fazenda',
        provinceId: 1,
        description: `Horse Ride in the Arena
Try your horse riding skills on a horse in a safe and secure environment. Our monitors stay with you all the time.

 
Trail Ride
Trail Ride
Discover the beauty of Mont Kigali and views of Kigali from a horse. This nature trail ride is unique in Rwanda.

 
Slide and Scream!
Slide and Scream!
The zip-lines give you the adrenaline not matter the age!

 
Who is the hunter in the family?
Who is the hunter in the family?
Show your family that you have what it takes to shoot the arrow in the bull's eye. This is modern Archery though...

 
Ever jumped so high?
Ever jumped so high?
The bungee lifts you several meters high. Feel like a bird and try the back flips and the front flips.

 
Quad Bikes
Quad Bikes
Fans of motorsport can discover the Mount Kigali trails on their own ways.`,
        latitude: -1.98553,
        longitude: 30.029214,
      },
      {
        address: 'Kigali, Nyandungu',
        title: 'Nyandungu Park',
        provinceId: 1,
        description: `
        Nyandungu Urban Wetland Ecotourism park is a 120-hectare Rwandan tourism park located between Gasabo 
        and Kicukiro Districts which allows sustainable travel of people to enjoy natural areas and wild animals 
        in Nyandungu Valley. The park included ornamental ponds, eastern gallery forests, medicinal plant gardens,
         paved walk ways, restaurants, information centers and other recreational services with the intention of 
         conserving the environment, educating visitors and improving the well-being of the local community. 
         It was implemented by Rwanda Environment Management Authority[3] (REMA) in 2020`,
        latitude: -1.955418,
        longitude: 30.145282,
      },
      {
        address: 'Kigali, Biryogo',
        provinceId: 1,
        title: 'Biryogo',
        latitude: -1.964788,
        longitude: 30.060237,
      },
      {
        address: 'Kigali, Gisozi',
        provinceId: 1,
        title: 'Kigali Memorial',
        latitude: -1.930092,
        longitude: 30.061456,
      },
      {
        address: 'Musanze, Cyuve',
        provinceId: 2,
        title: 'Musanze Caves',
        latitude: -1.53481,
        longitude: 29.517136,
      },
      {
        address: 'Musanze, Kinigi',
        provinceId: 2,
        title: 'Hiking',
        latitude: -1.452547,
        longitude: 29.586159,
      },
      {
        address: 'Burera',
        provinceId: 2,
        title: 'Twin Lakes: Burera & Ruhondo',
        latitude: -1.495164,
        longitude: 29.717561,
      },
      {
        address: 'Rusizi, Nyungwe',
        provinceId: 3,
        title: 'Nyungwe Forest National Park',
        latitude: -2.522194,
        longitude: 29.437211,
      },
      {
        address: 'Nyabihu, Gishwati',
        provinceId: 3,
        title: 'Gishwati‑Mukura, National Park',
        latitude: -1.83188,
        longitude: 29.346321,
      },
      {
        address: 'Kibuye, Bisesero',
        provinceId: 3,
        title: 'Bisesero Genocide Memorial Centre',
        latitude: -2.193085,
        longitude: 29.344883,
      },
      {
        address: 'Ruhango, Kibeho',
        provinceId: 4,
        title: 'Kibeho Holy Land',
        latitude: -2.647632,
        longitude: 29.55404,
      },
      {
        address: 'Rusizi, Nyungwe',
        provinceId: 4,
        title: 'Nyungwe Forest National Park',
        latitude: -2.523566,
        longitude: 29.435838,
      },
      {
        address: 'Huye, Butare',
        provinceId: 4,
        title: 'Rwanda Museum',
        latitude: -2.587995,
        longitude: 29.744196,
      },
      {
        address: 'Nyagatare, Akagera',
        provinceId: 5,
        title: 'Akagera National Park',
        latitude: -1.897049,
        longitude: 30.685408,
      },
      {
        address: 'Rwamagana, Muhazi',
        provinceId: 5,
        title: 'Muhazi Lake',
        latitude: -1.874847,
        longitude: 30.372324,
      },
      {
        address: 'Rwamagana, Rusumo',
        provinceId: 5,
        title: 'Rusumo Falls',
        latitude: -2.382219,
        longitude: 30.782931,
      },
    ],
  });
  console.log(' Provinces seeds added successfully');
  console.log('###########################################################');

  await prisma.locationImage.createMany({
    data: [
      {
        locationId: 1,
        url: 'https://tarama.ai/catalog/venues/66b333c12e2de_Fazenda-Sengha-horse-ride.jpg',
      },
      {
        locationId: 1,
        url: 'https://joaodomingosadv.com/wp-content/uploads/2020/10/fazenda-em-leilao.jpg',
      },
      {
        locationId: 1,
        url: 'https://fazendabananal.com.br/uploads/pagina/pagina/2023/09/Ek2jO74qlIWerFbj/fazenda-bananal-programe-sua-visita-principal-mob-v2.webp',
      },
      {
        locationId: 2,
        url: 'https://gggi.org/wp-content/uploads/2022/02/Nyandungi-IMAGE-5.jpg',
      },
      {
        locationId: 2,
        url: 'https://greenfund.rw/sites/default/files/2021-06/Nyandungu%20Wetland%20Graphic%20%281%29.jpg',
      },
      {
        locationId: 2,
        url: 'https://ugandarwandagorillatours.com/wp-content/uploads/2024/03/the-park-boasts-of-walkways-and-cycling-lanes-stretching-for-over-eight-kilometres.-courtesy.jpg',
      },
      {
        locationId: 2,
        url: 'https://www.rema.gov.rw/fileadmin/user_upload/FD0mpnRX0AQvxbG.jpg',
      },
      {
        locationId: 2,
        url: 'https://cdn.prod.website-files.com/649d52c85c2b81b728d6bf89/6522c9a67b09c48d75e0d172_Nyandungu%20Exeprience-min.jpg',
      },
      {
        locationId: 3,
        url: 'https://www.newtimes.co.rw/uploads/imported_images/files/main/articles/2022/06/20/52158390613_6505a8875f_k.jpg',
      },
      {
        locationId: 3,
        url: 'https://mobile.igihe.com/local/cache-vignettes/L1000xH667/fjskspbxwaa-pjy-f65ac.jpg',
      },
      {
        locationId: 3,
        url: 'https://cirht.med.umich.edu/wp-content/uploads/2022/07/a-wide-picture-of-the-beautiful-biryogo_0.jpeg',
      },
      {
        locationId: 3,
        url: 'https://mobile.igihe.com/local/cache-vignettes/L1000xH667/ubwo_hafungurwaga_byari_bigoye_kubona_n_aho_kwicara-f046e.jpg',
      },
      {
        locationId: 4,
        url: 'https://www.ahnasa.com/wp-content/uploads/2024/10/Kigali-Genocide-Memorial-800x600-1.jpg',
      },
      {
        locationId: 5,
        url: 'https://www.explorerwandatours.com/wp-content/uploads/2024/10/Musanze_caves_tour-750x450.png',
      },
      {
        locationId: 7,
        url: 'https://ecoadventuresafaris.com/wp-content/uploads/2024/05/Visiting-the-Twin-Lakes-of-Ruhondo-and-Burera-in-Rwanda-1200x675.jpeg',
      },
      {
        locationId: 8,
        url: 'https://www.insidenyungwenationalpark.com/wp-content/uploads/2022/07/chimpanzee-isumo-walk-tour-scaled.jpg',
      },
      {
        locationId: 9,
        url: 'https://www.arcadiasafaris.com/wp-content/uploads/2025/01/Gishwati-Makura-National-Park.jpg',
      },
      {
        locationId: 9,
        url: 'https://visitrwanda.com/wp-content/uploads/fly-images/1336/Visit-Rwanda-NH_OO_Activities_Chimpanzee_Trek_6853_MASTER-1920x1280.jpg',
      },
      {
        locationId: 9,
        url: 'https://www.ktpress.rw/wp-content/uploads/2021/05/Padock-.jpg',
      },
      {
        locationId: 9,
        url: 'https://www.gishwatimukuranationalpark.com/wp-content/uploads/2023/03/gishwati-mukura-park.jpg',
      },
      {
        locationId: 10,
        url: 'https://www.nyungweforestnationalpark.org/wp-content/uploads/2019/06/Bisesero-Genocide-Memorial-Centre-750x450.jpg',
      },
      {
        locationId: 10,
        url: 'https://www.justiceinfo.net/wp-content/uploads/50460ac025dff4013cce037d1652b4e1.jpg',
      },
      {
        locationId: 11,
        url: 'https://ikazerwandatours.com/wp-content/uploads/2023/03/Pilgrimage_to_Kibeho3-870x555.jpg',
      },
      {
        locationId: 11,
        url: 'https://www.ktpress.rw/wp-content/uploads/2019/08/Kibeho-Land-.jpg',
      },
      {
        locationId: 11,
        url: 'https://www.newtimes.co.rw/uploads/imported_images/files/main/articles/2017/09/09/1504990847catholics.jpg',
      },
      {
        locationId: 11,
        url: 'https://wingetsafaris.com/wp-content/uploads/2024/12/kibeho1.jpg',
      },
      {
        locationId: 11,
        url: 'https://www.ktpress.rw/wp-content/uploads/2024/02/Screenshot-from-2024-02-09-08-15-17-1.jpg',
      },
      {
        locationId: 12,
        url: 'https://www.insidenyungwenationalpark.com/wp-content/uploads/2022/07/chimpanzee-isumo-walk-tour-scaled.jpg',
      },
      {
        locationId: 12,
        url: 'https://www.nyungweforestnationalpark.org/wp-content/uploads/2022/02/canopy-rwanda-nyungwe-forest-1-1-750x450.jpg',
      },
      {
        locationId: 12,
        url: 'https://kigalicarrentals.com/wp-content/uploads/2021/02/Nyungwe-Forest-National-park.jpg',
      },
      {
        locationId: 12,
        url: 'https://visitrwanda.com/wp-content/uploads/fly-images/1363/Visit-Rwanda-NH_OO_Activities_Waterfall_Trek_0224_MASTER-1920x1280.jpg',
      },
      {
        locationId: 13,
        url: 'https://rwandainspirer.com/wp-content/uploads/2019/09/museum-1.jpg',
      },
      {
        locationId: 13,
        url: 'https://rwandainspirer.com/wp-content/uploads/2019/09/museum-1.jpg',
      },
      {
        locationId: 13,
        url: 'https://rentcarrwanda.com//storage/blog-content-dir/vF7SGc6KlyOsJWNJuidQtfpwwz7a89xwk3FrTNYH.png',
      },
      {
        locationId: 14,
        url: 'https://livinginkigali.com/wp-content/uploads/2016/08/Akagera-Hippos.jpg',
      },
      {
        locationId: 14,
        url: 'https://www.africanparks.org/sites/default/files/2017-07/akagera.jpg',
      },
      {
        locationId: 14,
        url: 'https://www.africanparks.org/sites/default/files/videos/akagera061021.jpg',
      },
      {
        locationId: 14,
        url: 'https://www.rwandasafaritour.com/wp-content/uploads/2020/02/akagera-national-park-1.jpg',
      },
      {
        locationId: 14,
        url: 'https://campandexplorer.com/wp-content/uploads/2024/06/Filming-in-Akagera-National-Park-e1597587467695-1200x600-750x450-1.jpg',
      },
      {
        locationId: 15,
        url: 'https://ugandarwandagorillatours.com/wp-content/uploads/2023/10/Lake-Muhazi-6.jpg',
      },
      {
        locationId: 15,
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Muhazi_beach_Resort.jpg',
      },
      {
        locationId: 15,
        url: 'https://www.africangorilla.com/wp-content/uploads/2022/08/Lake-Muhazi-Rwandas-Retreat-for-Fishing-Birding-Boating.jpg',
      },
      {
        locationId: 16,
        url: 'https://www.explorerwandatours.com/wp-content/uploads/2022/09/rusumo-falls.jpg',
      },
      {
        locationId: 16,
        url: 'https://beyondkigalitours.com/wp-content/uploads/2023/10/Rusumo-Falls.jpg',
      },
      {
        locationId: 16,
        url: 'https://www.andritz.com/resource/blob/397404/9efebceaa297e40135c7f85c86d0b4be/12-rusumo-falls-img-20191109-132325-02-data.jpg',
      },
    ],
  });

  await prisma.category.createMany({
    data: [
      { name: 'Travel & Emergency Info', isDoc: true }, // 1
      { name: 'Transportation Services', isDoc: false }, // 2
      { name: 'Accommodation & Booking Services', isDoc: false }, // 3
      { name: 'Communication & Connectivity', isDoc: true }, // 4
      { name: 'Money & Payments', isDoc: true }, // 5
      { name: 'Health & Wellness', isDoc: false }, // 6
      { name: 'Food & Dining', isDoc: false }, // 7
      { name: 'Local Events, Attractions & Tours', isDoc: true }, // 8
      { name: 'Shopping', isDoc: true }, // 9
      { name: 'Local Government Contacts', isDoc: true }, //10
      { name: 'Utility Services', isDoc: true }, //11
      { name: 'Cultural & Legal Norms', isDoc: true }, //12
      { name: 'Schools and Childcare', isDoc: true }, //13
      { name: 'Housing and Property Info', isDoc: true }, //14
      { name: 'Job Opportunities/Tenders', isDoc: true }, //15
      { name: 'Cultural and Religious Centers', isDoc: true }, //16
      { name: 'Pet Services', isDoc: false }, //17
    ],
  });
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
        name: 'Restaurants & reservation systems',
        categoryId: 7,
        featuredImage: `https://ultimatewildsafaris.com/images/rwanda_Restaurants.jpg`,
      }, // 9
      {
        name: 'Popular local food apps',
        categoryId: 7,
        featuredImage: `https://sprudge.com/wp-content/uploads/2019/07/Question-Coffee-Gishushu-Kigali-Rwanda-6.jpg`,
      }, // 10
      {
        name: 'Supermarkets',
        categoryId: 9,
        featuredImage: `https://www.simbaonlineshopping.com/Images/EdableOils.jpg`,
      }, // 11
      {
        name: 'Local Markets',
        categoryId: 9,
        featuredImage: `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/87/67/68/20190602-112015-largejpg.jpg`,
      }, // 12
      {
        name: 'Mini Markets',
        categoryId: 9,
        featuredImage: `https://c8.alamy.com/comp/ETF0A9/street-scene-with-brightly-painted-shops-nyamirambo-kigali-rwanda-ETF0A9.jpg`,
      }, // 13
      {
        name: 'Hospitals',
        categoryId: 6,
        featuredImage: `https://api.brusselstimes.com/wp-content/uploads/2021/02/rwanda-hospital-c-city-of-kigali.jpg`,
      }, // 14
      {
        name: 'Clinics',
        categoryId: 6,
        featuredImage: `https://www.entandaudiologynews.com/media/35440/ent-ma-24-reception-area-of-clinic.jpg`,
      }, // 15
      {
        name: 'Pharmacy',
        categoryId: 6,
        featuredImage: `https://www.wearetech.africa/media/k2/items/cache/38252c55502a1b07ebc1bd14c44c1fcb_XL.jpg`,
      }, // 16
      {
        name: 'Massage & Sauna',
        categoryId: 6,
        featuredImage: `https://www.newtimes.co.rw/thenewtimes/uploads/images/2025/01/24/thumbs/1200x700/68989.jpg`,
      }, // 17
      {
        name: 'Gym',
        categoryId: 6,
        featuredImage: `https://livinginkigali.com/wp-content/uploads/2023/03/Gym-life2.jpg`,
      }, // 18
    ],
  });
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
        latitude: -1.955762,
        longitude: 30.160187,
      },
      {
        title: `YEGO MOTTO`,
        description: `YEGOMOTO changes this forever. Simply flag down a YEGOMOTO, tell the Driver where to go, hop on, and be on your way! Passengers will pay the fare displayed on the YEGOMOTO Meter at the end of a trip. Fares are calculated automatically according to distance travelled. Additional waiting charges may apply. No more haggling on how much you need to pay. Imagine the time you will save, every single day! YEGOMOTO adds precious minutes back to your life and gets you to your destination quicker.`,
        location: `Kigali, Rwanda`,
        businessEmail: `info@yegomoto.com`,
        phoneNumber: `+250783919191`,
        subCategoryId: 2,
        workingHours: `24 Hours`,
        latitude: -1.957277,
        longitude: 30.104758,
      },
      {
        title: `KIGALI AIRPORT TRANSFERS`,
        description: `We provide both individuals and travel agents the most affordable, reliable, polite friendly service and quality airport taxi transfer services, anytime and anywhere.All our drivers are experienced Taxi Cab Drivers who have exemplary performance records. Travelling with comfort is our company's goal and top priority. We care about your experience anywhere you go`,
        location: `Kigali, Rwanda`,
        businessEmail: `info@kigalishuttle.com`,
        phoneNumber: `+250783698911`,
        subCategoryId: 3,
        workingHours: `24 Hours`,
        latitude: -1.944904,
        longitude: 30.058402,
      },
      {
        title: `Rwanda Safari Tour`,
        description: `Rwanda Safari Tour/Rwanda tours /Rwanda safaris are one of the best wildlife Expeditions that travelers can engage in when they plan to visit East Africa. Rwanda is a blessed country that has recently gained a wide exposure to the world and therefore a large number of travelers have flocked the country to be able to explore Rwanda on a Rwanda safari and its attractive feature with ofcourse the major attraction being gorilla trekking /Rwanda gorilla tour or Simply Rwanda gorilla trekking in Volcanoes national park.`,
        location: `Kigali, Rwanda`,
        businessEmail: `info@rwandasafaritour.com`,
        phoneNumber: `+250780870670`,
        subCategoryId: 4,
        workingHours: `24 Hours`,
        latitude: -1.959584,
        longitude: 30.081771,
      },
      {
        title: `Rwanda Eco Company & Safaris.`,
        description: `Rwanda Eco Company and Safaris is a local safari specialist, based in Kigali- Rwanda and Arusha - Tanzania specializes in arranging thrilling lifetime Safari Experiences. Our philosophy emphasises the participation of local communities in the tourism industry in order to let them benefit from East Africa's growing popularity. Additionally, we pay great attention to the protection and conservation of our environment including natural habitats and rural villages to become a more sustainable travel destination in the long term. Our trips perfectly combine the varied landscapes with outdoor activities as well as cultural tours in urban areas to create an authentic and unforgettable experience for the clients.`,
        location: `Kigali, Rwanda`,
        businessEmail: `info@rwandaecocompany.com`,
        phoneNumber: `+250788508228`,
        subCategoryId: 4,
        workingHours: `24 Hours`,
        latitude: -1.945182,
        longitude: 30.061229,
      },
    ],
  });
  console.log(' place items seed added successfully');
  console.log('###########################################################');

  await prisma.placeImage.createMany({
    data: [
      {
        placeId: 1,
        url: 'https://assets.volkswagen.com/is/image/volkswagenag/price-and-optionshb?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTE5MjAmaGVpPTEwODAmYWxpZ249MC4wMCwwLjAwJmJmYz1vZmYmM2E1Nw==',
      },
      {
        placeId: 1,
        url: 'https://assets.volkswagen.com/is/image/volkswagenag/Amarok_SSA_Mofa?Zml0PWNyb3AsMSZmbXQ9d2VicC1hbHBoYSZxbHQ9Nzkmd2lkPTEyODAmYmZjPW9mZiY4YTNi',
      },
      {
        placeId: 1,
        url: 'https://kigaliairporttaxitransfers.com/wp-content/uploads/2025/02/IMG_20231208_111107_972-scaled.jpg',
      },
      {
        placeId: 2,
        url: 'https://rba.co.rw/admin/media_data/cover_photo/IKORA29775.jpg',
      },
      {
        placeId: 2,
        url: 'https://www.yegomoto.com/videos/vid_3.jpg',
      },
      {
        placeId: 2,
        url: 'https://www.wearetech.africa/media/k2/items/cache/ca2d3b9781db35243fe5868c79aba4c0_XL.jpg',
      },
      {
        placeId: 2,
        url: 'https://www.ktpress.rw/wp-content/uploads/2017/10/yego-moto-driver.jpg',
      },
      {
        placeId: 3,
        url: 'https://www.ktpress.rw/wp-content/uploads/2017/10/yego-moto-driver.jpg',
      },
      {
        placeId: 4,
        url: 'https://kigaliairporttaxitransfers.com/wp-content/uploads/2025/02/IMG_20231208_111107_972-scaled.jpg',
      },
      {
        placeId: 5,
        url: 'https://rwandaecocompany.com/wp-content/uploads/2022/09/akagera.jpg',
      },
    ],
  });

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
      {
        title: `What Is UMUGANDA and How Is It Done`,
        authorId: 1,
        categoryId: 8,
        description: `Key aspects of Umuganda:
Community Service:
Umuganda involves various community improvement projects like cleaning streets, building infrastructure (like classrooms and latrines), and environmental conservation efforts. 
National Unity:
It promotes a sense of shared responsibility and national identity among Rwandans. 
Dialogue and Communication:
Umuganda serves as a platform for national leaders to interact with citizens and communicate public policies. 
Decentralized Development:
It encourages citizen participation in development planning and implementation. 
Historical Roots:
Umuganda has its origins in Rwandan culture and was reintroduced after the 1994 genocide to foster healing and rebuilding. `,
        featuredImg: `https://live.staticflickr.com/5798/31026911786_21df9fef37.jpg`,
        summary: `Umuganda is a mandatory community work program in Rwanda held on the last Saturday of every month. It translates to "coming together in common purpose to achieve an outcome". Rwandans aged 18-65 are required to participate, with those 65 and older participating optionally. The program aims to foster community development and national unity through collective action. `,
        location: `Rwanda`,
      },
      {
        title: 'Best Hotels in Karongi District',
        authorId: 1,
        categoryId: 1,
        summary:
          'Top Picks by Travel Style For upscale lake views & unique lodging: Cormoran Lodge, Golf Eden Rock, Ruzizi Lodge For business or mid-range comfort: Delta Resort, Rebero Kivu, Romantic Hotel For eco or pet-friendly stays: Rwiza Village, Umutuzo Lodge',
        description:
          ' A charming wooden‑cabin lodge with about seven rooms perched right on Lake Kivu. From the VIP cabin, you can view Nyiragongo volcano in Congo. It’s often regarded as one of the older high‑end places in the region. Golf Eden Rock Hotel \n Located directly on a sandy beach in Kibuye, this hotel offers peaceful lakeside dining (including an upscale beach bar and VIP bar) and good value for both leisure and business travelers. \n Rwiza Village\n A cozy 3-star lodge ideal for families and pet owners. Set in a tranquil location, guests enjoy warm service and easy access to boat trips and outdoor excursions. \nDelta Resort Hotel \n Classified around 3.5 stars, this hotel combines beachfront leisure with business‑friendly meeting rooms. It’s convenient for both relaxation and professional gatherings.\n Rebero Kivu Resort \n A lakeside property with multiple conference facilities, perfect for corporate travelers seeking comfortable rooms and work‑ready amenities by the water.',
        featuredImg:
          'https://www.shutterstock.com/shutterstock/photos/1424011988/display_1500/stock-photo-city-kibuye-karongi-district-rwanda-january-cormoran-lodge-hotel-scenic-spectacular-1424011988.jpg',
        location: 'Karongi',
        provinceId: 3,
      },
      {
        authorId: 1,
        categoryId: 4,
        title: 'Best telecom to use in Southern Rwanda',
        location: 'Butare',
        provinceId: 4,
        featuredImg: `https://www.itnewsafrica.com/wp-content/uploads/2014/09/telecommunication-tower-720.jpg`,
        summary: `Rwanda’s telecom landscape is dominated by three operators:

MTN Rwanda – hold the largest market share

Airtel Rwanda – strong competitor, especially on price

KTRN (KT Rwanda Networks) – infrastructure provider powering the 4G/LTE network used by MTN and Airtel 
Both MTN and Airtel provide 2G and 3G, while 4G speeds are delivered via the KT Rwanda network to both providers 
Phone Travel Wiz
`,
        description: `
        🌍 Coverage in Southern Province
Southern Province includes districts such as Huye, Nyanza, Muhanga, Nyamagabe, Gisagara, Ruhango, Nyaruguru, and Kamonyi 
. Mobile coverage is extensive:

MTN built out its LTE network nationwide, covering over 99% of the population by end of 2023 and targets 99.9% coverage by end of 2025 
ktrn
Developing Telecoms
.

Airtel also uses the KT Rwanda network to deliver 4G services across almost the entire country.

Vanu Rwanda, in partnership with Airtel, has deployed solar-powered sites to extend coverage into more rural and mountainous zones in collaboration with mobile operators 

🚀 Network Performance & Speed
A benchmarking performed during MWC Kigali 2023 showed:

MTN delivered average LTE download speeds of ~38 Mbps and upload speeds ~18 Mbps

Airtel averaged ~20 Mbps download and ~13 Mbps upload

Signal quality was also better on MTN with a stronger measured signal (~–77.8 dBm vs Airtel ~–94.6 dBm) 

Reddit and traveler feedback generally praise MTN for coverage and speed, though Airtel is noted as more affordable and still solid elsewhere`,
      },
    ],
  });
  console.log(' doc items seed added successfully');
  console.log('###########################################################');

  await prisma.notification.create({
    data: {
      body: `Explore nearby spots, reviews & hidden gems — start your journey now!`,
      title: '🎉 Welcome to NearMe!',
      type: 'SYSTEM',
    },
  });

  console.log(' welcome nnotification');
  console.log('###########################################################');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
